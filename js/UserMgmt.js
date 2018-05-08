"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = db => {
  let handler = (res, qsql) => {
    let handler = recordset => {
      //   console.log(recordset);
      res.json({ data: recordset["recordset"] });
    };

    let errHandler = err => {
      res.status(400).send(`${err}`);
    };

    db(qsql, handler, errHandler);
  };

  let postHandler = (res, qsql) => {
    let handler = recordset => {
      //   console.log(recordset);
      res.sendStatus(202);
    };

    let errHandler = err => {
      res.status(400).send(err);
    };

    db(qsql, handler, errHandler);
  };

  let router = express.Router();

  router.use(bodyParser.json()); // support json encoded bodies
  router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  router.get("/", (req, res) => {
    res.send("hello user management!");
  });

  // select user row by id
  router.get("/all", (req, res) => {
    let qsql = `SELECT user_system_id, account_name, first_name, last_name, user_phone_number, user_email FROM user_info.user_table`;
    handler(res, qsql);
  });

  // select user row by id
  router.get("/allUsername", (req, res) => {
    let qsql = `select  account_name from user_info.user_table`;
    handler(res, qsql);
  });

  // select user row by id
  router.get("/:id", (req, res) => {
    let qsql = `SELECT user_system_id, account_name, first_name, last_name, user_phone_number, user_email FROM user_info.user_table WHERE user_system_id = ${
      req.params.id
      }`;
    handler(res, qsql);
  });

  // select user district by id
  router.get("/district/:id", (req, res) => {
    // let qsql = `insert into user_info.district (user_system_id, district_phase3) values (1, 1)`;

    let qsql = `SELECT * FROM user_info.district WHERE user_system_id = ${
      req.params.id
      }`;
    handler(res, qsql);
  });

  // edit user district by id
  router.post("/district/edit/:id&:district", (req, res) => {
    let qsql = `UPDATE user_info.district SET district_phase2 = ${req.params.district},
    district_phase3 = ${req.params.district}
    WHERE user_system_id = ${
      req.params.id
      }`;
    postHandler(res, qsql);
  });

  // add user district by id
  router.post("/district/add/:id&:district", (req, res) => {
    let qsql = `INSERT INTO user_info.district (user_system_id, district_phase2, district_phase3) VALUES (${req.params.id}, ${req.params.district}, ${req.params.district})`;
    postHandler(res, qsql);
  });

  // edit user by id
  router.post("/edit/:id", (req, res) => {
    let first_name = req.body.first_name || "";
    let last_name = req.body.last_name || "";

    let qsql = `UPDATE user_info.user_table SET
      account_name = '${req.body.username}', 
      user_phone_number = '${req.body.phone}',
      user_email = '${req.body.email}',
      first_name = '${first_name}',
      last_name = '${last_name}'
      WHERE user_system_id =
      ${req.params.id}`;

    postHandler(res, qsql);
  });

  // rm user by id
  router.post("/rm/:id", (req, res) => {
    let qsql = `DELETE FROM user_info.user_table WHERE user_system_id = 
      ${req.params.id}`;

    postHandler(res, qsql);
  });

  // add user
  router.post("/add", (req, res) => {
    let first_name = req.body.first_name || "";
    let last_name = req.body.last_name || "";

    let qsql = `BEGIN 
    INSERT INTO user_info.user_table 
    (account_name, user_phone_number, user_email, first_name, last_name)
    VALUES(
      '${req.body.username}',
      '${req.body.phone}',
      '${req.body.email}',
      '${first_name}',
      '${last_name}');
      SELECT TOP 1 * FROM user_info.user_table ORDER BY user_system_id DESC;
      END`;
    handler(res, qsql);
  });

  return router;
};
