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
    let qsql = `SELECT * FROM proposal.proposal_final ORDER BY LEN(proposal_id), proposal_id`;
    handler(res, qsql);
  });

  router.get("/vote", (req, res) => {
    let qsql = `SELECT 
    proposal.proposal_final.proposal_id,
    proposal.proposal_final.final_proposal_title,
    proposal.proposal_final.final_project_location,
    proposal.proposal_final.cost,
    proposal.proposal_final.final_proposal_idea,
    proposal.proposal_final.proposal_need,
    proposal.proposal_final.final_proposal_latitude,
    proposal.proposal_final.final_proposal_longitude,
    proposal.proposal_final.project_type,
    proposal.proposal_final.department,
    proposal.proposal_final.who_benefits,
    proposal.proposal_final.council_district,
    proposal.proposal_final.neihborhood
    FROM stage.stage3 JOIN proposal.proposal_final ON stage.stage3.proposal_id=proposal.proposal_final.proposal_id`;
    handler(res, qsql);
  });

  router.get("/grade", (req, res) => {
    let qsql = `SELECT 
    proposal.proposal_final.proposal_id,
    proposal.proposal_final.final_proposal_title,
    proposal.proposal_final.final_project_location,
    proposal.proposal_final.cost,
    proposal.proposal_final.final_proposal_idea,
    proposal.proposal_final.proposal_need,
    proposal.proposal_final.final_proposal_latitude,
    proposal.proposal_final.final_proposal_longitude,
    proposal.proposal_final.project_type,
    proposal.proposal_final.department,
    proposal.proposal_final.who_benefits,
    proposal.proposal_final.council_district,
    proposal.proposal_final.neihborhood
    FROM stage.stage2 JOIN proposal.proposal_final ON stage.stage2.proposal_id=proposal.proposal_final.proposal_id`;
    handler(res, qsql);
  });

  router.get("/display", (req, res) => {
    let qsql = `SELECT 
    proposal.proposal_final.proposal_id,
    proposal.proposal_final.final_proposal_title,
    proposal.proposal_final.final_project_location,
    proposal.proposal_final.cost,
    proposal.proposal_final.final_proposal_idea,
    proposal.proposal_final.proposal_need,
    proposal.proposal_final.final_proposal_latitude,
    proposal.proposal_final.final_proposal_longitude,
    proposal.proposal_final.project_type,
    proposal.proposal_final.department,
    proposal.proposal_final.who_benefits,
    proposal.proposal_final.council_district,
    proposal.proposal_final.neihborhood
    FROM stage.stage4 JOIN proposal.proposal_final ON stage.stage4.proposal_id=proposal.proposal_final.proposal_id`;
    handler(res, qsql);
  });

  // edit proposal in final_proposal table
  router.post("/edit/:pid", (req, res) => {
    let escape = function (str) {
      return str.replace(/'/g, "\'\'");
    }

    let final_proposal_title = escape(req.body.final_proposal_title);
    let final_proposal_idea = escape(req.body.final_proposal_idea);
    let final_project_location = escape(req.body.final_project_location);
    let proposal_need = escape(req.body.proposal_need);
    let project_type = escape(req.body.project_type);
    let department = escape(req.body.department);
    let who_benefits = escape(req.body.who_benefits);
    let neihborhood = escape(req.body.neihborhood);

    let qsql = `UPDATE proposal.proposal_final SET 
    final_proposal_title = '${final_proposal_title}',
    final_proposal_idea = '${final_proposal_idea}',
    final_project_location = '${final_project_location}',
    cost = ${req.body.cost},
    proposal_need = '${proposal_need}',
    final_proposal_latitude = ${req.body.final_proposal_latitude},
    final_proposal_longitude = ${req.body.final_proposal_longitude},
    project_type = '${project_type}',
    department = '${department}',
    who_benefits = '${who_benefits}',
    council_district = ${req.body.council_district},
    neihborhood = '${neihborhood}'
    WHERE proposal_id='${req.params.pid}'`;

    postHandler(res, qsql);
  });

  // rm final by id
  router.post("/rm/:id", (req, res) => {
    let qsql = `DELETE FROM proposal.proposal_final WHERE proposal_id = 
      '${req.params.id}'`;

    postHandler(res, qsql);
  });

  // get final proposal info
  router.get("/:pid", (req, res) => {
    let qsql = `SELECT * from proposal.proposal_final WHERE proposal_id='${
      req.params.pid
      }'`;

    handler(res, qsql);
  });

  return router;
};
