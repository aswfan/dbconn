"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = db => {
  let getHandler = (res, qsql) => {
    let getHandler = recordset => {
      //   console.log(recordset);
      res.json({ data: recordset["recordset"] });
    };
    db.query(qsql, getHandler);
  };

  let postHandler = (res, qsql) => {
    let postHandler = recordset => {
      //   console.log(recordset);
      res.send(201);
    };
    db.query(qsql, postHandler);
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
    let qsql = `insert into user_info.grade (user_system_id, proposal_id, grade_1st, grade_2nd, grade_final) VALUES (${
      req.params.uid
    }, ${req.params.pid}, ${req.body.grade_1st}, ${req.body.grade_2nd}, ${
      req.body.grade_final
    })`;
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

  return router;
};
