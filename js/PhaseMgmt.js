"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const verifyToken = require("./VerifyToken");

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

  // select user row by id
  router.get("/all", (req, res) => {
    let qsql = `SELECT * FROM stage.phase`;
    handler(res, qsql);
  });

  // edit currentPhase
  router.post("/editCurrentPhase/:original&:new", verifyToken, (req, res) => {
    let time = (new Date).toISOString();
    let qsql = `IF exists( SELECT * FROM stage.phase) 
    UPDATE stage.phase SET
    current_phase = ${req.params.new} WHERE current_phase = ${
      req.params.original
    } ;
    ELSE 
    INSERT INTO stage.phase (current_phase, phase1_end, phase2_end, phase3_end) 
    VALUES(1, '${time}', '${time}', '${time}');`;
    postHandler(res, qsql);
  });

  // edit end dates
  router.post("/editEndDates/:phase", verifyToken, (req, res) => {
    let qsql = `UPDATE stage.phase SET
    phase1_end = '${req.body.phase1_end}',
    phase2_end = '${req.body.phase2_end}',
    phase3_end = '${req.body.phase3_end}'
    WHERE current_phase = ${req.params.phase}`;
    postHandler(res, qsql);
  });

  return router;
};
