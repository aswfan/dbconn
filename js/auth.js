"use strict";

const express = require("express");
const verifyToken = require("./VerifyToken");
const path = require('path');
const async = require('async');
const crypto = require('crypto');
const smtpTransport = require("./SendMail");

module.exports = db => {
  let router = express.Router();
  let bodyParser = require("body-parser");

  let query = db;

  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  let jwt = require("jsonwebtoken");
  let bcrypt = require("bcryptjs");
  let secret = process.env.SECRET || "supersecret";

  router.post("/register", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (!username) {
      return res.status(400).send("username for registration is required!");
    }

    if (!password) {
      return res.status(400).send("password for registration is required!");
    }
    var phone = req.body.phone || "";
    var email = req.body.email || "";

    let hashedPassword = bcrypt.hashSync(req.body.password, 8);

    var qsql = `BEGIN
			IF NOT EXISTS (SELECT * FROM user_info.user_table 
							WHERE account_name = '${username}')
			BEGIN
				INSERT INTO user_info.user_table (account_name, user_phone_number, user_email, user_password)
				VALUES ('${username}', '${phone}', '${email}', '${hashedPassword}')
			END
		END`;

    let handler = recordset => {
      if (recordset["rowsAffected"] == 0) {
        return res.status(500).send("User with the username already exists!");
      }

      let token = jwt.sign({ username: username }, secret, { expiresIn: 300 });

      res.status(200).send({ auth: true, token: token });
    };

    let errHandler = err => {
      res.status(400).send(`${err}`);
    };

    query(qsql, handler, errHandler);
  });

  router.post("/login", (req, res) => {
    var username = req.body.username;
    if (!username) {
      return res.status(400).send("username for login cannot be empty!");
    }
    let qsql = `SELECT user_password From user_info.user_table where account_name = '${username}'`;

    let handler = recordset => {
      if (recordset["rowsAffected"] == 0) {
        return res.status(401).send("Specified user does not exists!");
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        recordset["recordset"][0]["user_password"]
      );
      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
      }

      let token = jwt.sign({ username: username }, secret, { expiresIn: 300 });
      res.status(200).send({ auth: true, token: token });
    };

    let errHandler = err => {
      res.status(400).send(`${err}`);
    };

    query(qsql, handler, errHandler);
  });

  router.get("/me", verifyToken, (req, res) => {
    // console.log(req.username);
    let qsql = `SELECT user_system_id AS id, account_name AS username, user_phone_number AS phone, user_email AS email From user_info.user_table where account_name = '${
      req.username
    }'`;

    let handler = recordset => {
      if (recordset["rowsAffected"] == 0) {
        return res.status(401).send("username or password does not match!");
      }
      res.status(200).send(recordset["recordset"]);
    };

    let errHandler = err => {
      res.status(400).send(`${err}`);
    };

    query(qsql, handler, errHandler);
  });

  router.get("/logout", (req, res) => {
    res.status(200).send({ auth: false, token: null });
  });

  router.get("/forgot_password", (req, res) => { return res.sendFile(path.resolve('./template/forgot-password.html')); })
        .post("/forgot_password", (req, res) => {
            let email = req.body.email;
            async.waterfall([
              function(done) {
                let qsql = `SELECT * FROM user_info.user_table WHERE user_email='${email}'`;
                let handler = recordset => {
                  if (recordset["rowsAffected"] == 0) {
                    done('Specified user does not exists!');
                  } else {
                    done(null, recordset["recordset"][0])
                  }
                };

                let errHandler = err => {
                  done(err);
                };
                query(qsql, handler, errHandler);
              },
              function(user, done) {
                // create the random token
                crypto.randomBytes(20, function(err, buffer) {
                  var token = buffer.toString('hex');
                  done(err, user, token);
                });
              },
              function(user, token, done) {
                var today = new Date();
                var dd = today.getDate() + 1; //expire date is one more day later
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd;
                } 
                if(mm<10){
                    mm='0'+mm;
                } 
                var today = yyyy + mm + dd;
                let qsql = `UPDATE user_info.user_table 
                              SET reset_password_token='${token}', reset_password_expires=CAST('${today}' AS DATETIME) 
                            WHERE user_system_id=${user['user_system_id']}`;
                let handler = recordset => {
                  if (recordset["rowsAffected"] > 0) {
                    done(null, token, user);
                  } else {
                    done('Cannot find specified record!');
                  }
                };

                let errhandler = err => {
                  done(err);
                }
                query(qsql, handler, errhandler);
              },
              function(token, user, done) {
                if(!process.env.EMAIL_ID || !process.env.EMAIL_PWD ) {
                  return res.status(500).send(`Error: no envirnment variable EMAIL_ID or EMAIL_PWD was provided!`);
                }
                if(!process.env.BACKEND_IP || !process.env.BACKEND_PORT) {
                  return res.status(500).send('Error: no envirnment variable BACKEND_IP or BACKEND_PORT was provided!');
                }
                var data = {
                  to: email,
                  from: user['user_email'],
                  template: 'forgot-password-email',
                  subject: 'Password help has arrived!',
                  context: {
                    url: process.env.BACKEND_IP + ':' + process.env.BACKEND_PORT + '/auth/reset_password?token=' + token,
                    name: user['first_name'] + ' ' + user['last_name']
                  }
                };

                smtpTransport.sendMail(data, function(err) {
                  if (!err) {
                    return res.json({ message: 'Kindly check your email for further instructions' });
                  } else {
                    done(err);
                  }
                });
              }
            ], function(err) {
              console.log(err);
              return res.status(422).json({ message: `${err}` });
            });
          });

  router.get('/reset_password', (req, res) => { return res.sendFile(path.resolve('./template/reset-password.html')); })
        .post('/reset_password', (req, res) => {
          var today = new Date();
          var dd = today.getDate(); //expire date is one more day later
          var mm = today.getMonth() + 1; //January is 0!

          var yyyy = today.getFullYear();
          if(dd<10){
              dd='0'+dd;
          } 
          if(mm<10){
              mm='0'+mm;
          } 
          var today = yyyy + mm + dd;
          let qsql = `SELECT * 
                      FROM user_info.user_table 
                      WHERE reset_password_token='${req.body.token}' AND reset_password_expires > CAST('${today}' as DateTime)`;
          let handler = recordset => {
            if(recordset["rowsAffected"] == 0) {
              return res.status(422).send({ message: 'Error: Password reset token is invalid or has expired!' });
            }
            
            let user = recordset['recordset'][0];
            if (req.body.newPassword === req.body.verifyPassword) {
              let hash_password = bcrypt.hashSync(req.body.newPassword, 8);
              user.reset_password_token = undefined;
              user.reset_password_expires = undefined;
              let qsql = `UPDATE user_info.user_table
                            SET user_password = '${hash_password}', reset_password_token = NULL, reset_password_expires = NULL 
                          WHERE user_system_id = ${user['user_system_id']}`

              let handler = recordset => {
                if(recordset["rowsAffected"] == 0) {
                  return res.status(422).send({ message: 'Error: cannot find specified record!' });
                }

                if(!process.env.EMAIL_ID || !process.env.EMAIL_PWD ) {
                  return res.status(500).send('Error: no envirnment variable EMAIL_ID or EMAIL_PWD or SELF_ID was provided!');
                }
                var data = {
                  to: user['user_email'],
                  from: process.env.EMAIL_ID,
                  template: 'reset-password-email',
                  subject: 'Password Reset Confirmation',
                  context: {
                    name: user['first_name'] + ' ' + user['last_name']
                  }
                };
    
                smtpTransport.sendMail(data, function(err) {
                  if (!err) {
                    return res.status(200).json({ message: 'Password reset' });
                  } else {
                    return res.status(500).json({ message: `${err}` });;
                  }
                });
              }
              let errhandler = err => {
                console.log(err);
                return res.status(422).send({ message: err });
              }
              query(qsql, handler, errhandler);
            } else {
              console.log(err);
              return res.status(422).send({ message: 'Passwords do not match' });
            }
          }
          let errhandler = err => {
            console.log(err);
            return res.status(422).send({ message: err });
          }
          query(qsql, handler, errhandler);
      });

  return router;
};
