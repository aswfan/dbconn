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
      res.status(400).send(err);
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
    let qsql = `select * from user_info.user_table`;
    handler(res, qsql);
  });

  // select user row by id
  router.get("/allUsername", (req, res) => {
    let qsql = `select  account_name from user_info.user_table`;
    handler(res, qsql);
  });

  // select user row by id
  router.get("/:id", (req, res) => {
    let qsql = `select * from user_info.user_table where user_system_id = ${
      req.params.id
    }`;
    handler(res, qsql);
  });

  // edit user by id
  router.post("/edit/:id", (req, res) => {
    let qsql = `UPDATE user_info.user_table SET
      account_name = '${req.body.username}', 
      user_phone_number = '${req.body.phone}',
      user_email = '${req.body.email}' WHERE user_system_id = 
      ${req.params.id}`;

    postHandler(res, qsql);
  });

  // rm user by id
  router.post("/rm/:id", (req, res) => {
    let qsql = `DELETE FROM user_info.user_table WHERE user_system_id = 
      ${req.params.id}`;

    postHandler(res, qsql);
  });

  // rm user by id
  router.post("/add/:id", (req, res) => {
    let qsql = `INSERT INTO user_info.user_table 
    (account_name, user_phone_number, user_email)
    VALUES( 
      '${req.body.username}',
      '${req.body.phone}',
      '${req.body.email}')`;
    postHandler(res, qsql);
  });

  return router;
};
