"use strict";

const express = require("express");
const verifyToken = require("./VerifyToken");

module.exports = db => {
  let router = express.Router();
  let bodyParser = require("body-parser");

  let query = db.query;

  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  let jwt = require("jsonwebtoken");
  let bcrypt = require("bcryptjs");
  let secret = process.env.SECRET || "supersecret";

  router.post("/register", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

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
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

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
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    // console.log(req.username);
    let qsql = `SELECT account_name AS username, user_phone_number AS phone, user_email AS email From user_info.user_table where account_name = '${
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    res.status(200).send({ auth: false, token: null });
  });

  return router;
};
