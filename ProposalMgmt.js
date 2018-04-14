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

  let router = express.Router();

  router.use(bodyParser.json()); // support json encoded bodies
  router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  // post final proposal
  router.post("/:id", (req, res) => {
    let qsql = `UPDATE proposal.final_proposal (proposal_id
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
        ,neihborhood) VALUES (${req.params.id}, ${
      req.body.final_proposal_title
    }, ${req.body.final_proposal_idea}, ${req.body.final_project_location}, ${
      req.body.cost
    }),${req.body.final_proposal_latitude}),${req.body.project_type}),${
      req.body.department
    }),${req.body.who_benefits}),${req.body.council_district}),${
      req.body.neihborhood
    })`;
    handler(res, qsql);
  });

  router.get("/:pid", (req, res) => {
    let qsql = `SELECT * from proposal.final_proposal WHERE proposal_id=${
      req.params.id
    }`;

    handler(res, qsql);
  });

  router.get("/all", (req, res) => {
    let qsql = `SELECT * FROM proposal.final_proposal`;

    handler(res, qsql);
  });

  return router;
};
