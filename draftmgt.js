"use strict";

const express = require("express");
const bodyParser = require('body-parser');

module.exports = db => {
  let handler = (res, qsql) => {
    let handler = recordset => {
      //   console.log(recordset);
      res.json({ data: recordset["recordset"] });
    };
    db(qsql, handler);
  };

  let router = express.Router();

  router.use(bodyParser.json()); // support json encoded bodies
  router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  

  router.get("/", (req, res) => {
    res.send("hello draft management!");
  });

  router.get("/all", (req, res) => {
    let qsql = `select * from proposal.draft_proposal`;

    handler(res, qsql);
  });

  router.get("/:id", (req, res) => {
    let qsql = `select * from proposal.draft_proposal where draft_id=${
      req.params.id
    }`;

    handler(res, qsql);
  });

  router.post("/add", (req, res) => {

    var draft_id = req.body.draft_id;
    var proposal_title = req.body.proposal_title;
    var proposal_idea = req.body.proposal_idea;
    var proposal_latitude = req.body.proposal_latitude;
    var proposal_longitude = req.body.proposal_longitude;
    var project_location = req.body.project_location;

    let qsql = `insert into proposal.draft_proposal (draft_id, proposal_title, proposal_idea, proposal_latitude, proposal_longitude, project_location) values (${draft_id}, '${proposal_title}', '${proposal_idea}', ${proposal_latitude}, ${proposal_longitude}, '${project_location}')`;

    handler(res, qsql);
  });

  return router;
};
