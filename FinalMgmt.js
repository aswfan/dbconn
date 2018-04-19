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
    let qsql = `SELECT * FROM proposal.proposal_final ORDER BY proposal_id`;
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

  router.post("/insertMassive", (req, res) => {
    let qsql = `BEGIN `;

    for (let i = 1; i < 400; i++) {
      qsql += `INSERT INTO proposal.proposal_final(
        proposal_id
        ,final_proposal_title
        ,final_proposal_idea
        ,final_project_location
        ,cost
        ,proposal_need
        ,final_proposal_latitude
        ,final_proposal_longitude
        ,project_type
        ,department
        ,who_benefits
        ,council_district
        ,neihborhood
      ) VALUES('${i}','testset','build a lot water pumps for fire fighter','3rd Ave, Belltown',10,'firefighter',47.6062,122.3321,'security','SHE','everyone',3,'belltown');
      `
    }
    qsql += ` END`
    //console.log(qsql);
    postHandler(res, qsql);
  })

  return router;
};
