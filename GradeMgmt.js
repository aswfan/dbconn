"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = db => {
  let getHandler = (res, qsql) => {
    let getHandler = recordset => {
      //   console.log(recordset);
      res.json({ data: recordset["recordset"] });
    };

    let errHandler = err => {
      res.status(400).send(`${err}`);
    };

    db(qsql, getHandler, errHandler);
  };

  let postHandler = (res, qsql) => {
    let postHandler = recordset => {
      //   console.log(recordset);
      res.sendStatus(202);
    };

    let errHandler = err => {
      res.status(400).send(err);
    };

    db(qsql, postHandler, errHandler);
  };

  let router = express.Router();

  router.use(bodyParser.json()); // support json encoded bodies
  router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  // get user's grade on proposal
  router.get("/:uid&:pid", (req, res) => {
    let qsql = `select * from user_info.grade where user_system_id=${
      req.params.uid
    }and proposal_id=${req.params.pid}`;
    getHandler(res, qsql);
  });

  // post user's grade on proposal
  router.post("/:uid&:pid", (req, res) => {
    let qsql = `insert into user_info.grade (user_system_id, proposal_id, grade_Need_at_location, grade_Community_Benefit, grade_final) VALUES (${
      req.params.uid
    }, ${req.params.pid}, ${req.body.grade_Need_at_location}, ${
      req.body.grade_Community_Benefit
    }, ${req.body.grade_Community_Benefit + req.body.grade_Need_at_location})`;
    postHandler(res, qsql);
  });

  // get proposal's aggregation grade
  router.get("/agg/:pid", (req, res) => {
    let qsql = `SELECT SUM(grade_final) AS grade FROM user_info.grade WHERE proposal_id=${
      req.params.pid
    } GROUP BY proposal_id`;

    getHandler(res, qsql);
  });

  // get all proposals' aggregation grades
  router.get("/aggAll", (req, res) => {
    let qsql = `SELECT proposal_id, SUM(grade_final) AS grade FROM user_info.grade GROUP BY proposal_id`;

    getHandler(res, qsql);
  });

  // clean table user_info.grade
  router.post("/clean", (req, res) => {
    let qsql = `DELETE FROM user_info.grade`;
    postHandler(res, qsql);
  });

  return router;
};
