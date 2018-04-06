"use strict";

const express = require("express");

module.exports = db => {
  let getHandler = (res, qsql) => {
    let getHandler = recordset => {
      //   console.log(recordset);
      res.json({ data: recordset["recordset"] });
    };

    let errHandler = err => {
      res.status(400).send(err);
    };

    db.query(qsql, handler, errHandler);
  };

  let postHandler = (res, qsql) => {
    let postHandler = recordset => {
      res.send(201);
    };

    let errHandler = err => {
      res.status(400).send(err);
    };

    db.query(qsql, handler, errHandler);
  };

  let router = express.Router();

  router.get("/", (req, res) => {
    res.send("hello vote management!");
  });
  // post user's vote on proposal
  // need editing
  router.post("/:uid&:pid", (req, res) => {
    let qsql = `insert into user_info.vote (user_system_id, proposal_id) VALUES (${
      req.params.uid
    }, ${req.params.pid})`;
    postHandler(res, qsql);
  });

  // get proposal's aggregation vote
  router.get("/agg/:pid", (req, res) => {
    let qsql = `SELECT proposal_id, COUNT(*) as vote FROM user_info.vote WHERE proposal_id=${
      req.params.pid
    } GROUP BY proposal_id`;
    getHandler(res, qsql);
  });

  // get all proposals' aggregation votes
  router.get("/aggAll", (req, res) => {
    let qsql = `SELECT proposal_id, COUNT(*) AS vote FROM user_info.vote GROUP BY proposal_id`;
    getHandler(res, qsql);
  });

  // check how many votes the user has
  router.get("/check/:uid", (req, res) => {
    let qsql = `SELECT user_system_id, COUNT(*) as counts FROM user_info.vote WHERE user_system_id=${
      req.params.uid
    } GROUP BY user_system_id`;
    getHandler(res, qsql);
  });

  return router;
};
