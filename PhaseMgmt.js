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

  // select user row by id
  router.get("/all", (req, res) => {
    let qsql = `SELECT * FROM stage.phase`;
    handler(res, qsql);
  });

  // edit currentPhase
  router.post("/editCurrentPhase/:original&:new", (req, res) => {
    let qsql = `UPDATE stage.phase SET
    current_phase = ${req.params.new} WHERE current_phase = ${req.params.original}`;
    postHandler(res, qsql);
  });

  // edit end dates
  router.post("/editEndDates/:phase", (req, res) => {
    let qsql = `UPDATE stage.phase SET
    phase1_end = '${req.body.phase1_end}',
    phase2_end = '${req.body.phase2_end}',
    phase3_end = '${req.body.phase3_end}'
    WHERE current_phase = ${req.params.phase}`;
    postHandler(res, qsql);
  });

  return router;
};
