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

  //TODO: import excel

  router.get("/all", (req, res) => {
    let qsql = `SELECT * FROM proposal.proposal_final`;
    handler(res, qsql);
  });

  // edit proposal in final_proposal table
  router.post("/edit/:pid", (req, res) => {
    let qsql = `UPDATE proposal.proposal_final SET 
    final_proposal_title = '${req.body.final_proposal_title}',
    final_proposal_idea = '${req.body.final_proposal_idea}',
    final_project_location = '${req.body.final_project_location}',
    cost = ${req.body.cost},
    proposal_need = '${req.body.proposal_need}',
    final_proposal_latitude = ${req.body.final_proposal_latitude},
    final_proposal_longitude = ${req.body.final_proposal_longitude},
    project_type = '${req.body.project_type}',
    department = '${req.body.department}',
    who_benefits = '${req.body.who_benefits}',
    council_district = ${req.body.council_district},
    neihborhood = '${req.body.neihborhood}' 
    WHERE proposal_id=${req.params.pid}`;

    postHandler(res, qsql);
  });

  // rm final by id
  router.post("/rm/:id", (req, res) => {
    let qsql = `DELETE FROM proposal.proposal_final WHERE proposal_id = 
      ${req.params.id}`;

    postHandler(res, qsql);
  });

  // get final proposal info
  router.get("/:pid", (req, res) => {
    let qsql = `SELECT * from proposal.proposal_final WHERE proposal_id=${
      req.params.pid
    }`;

    handler(res, qsql);
  });

  return router;
};
