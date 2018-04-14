"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = db => {
  let handler = (res, qsql) => {
    let handler = recordset => {
      //   console.log(recordset);
      res.json({
        data: recordset["recordset"]
      });
    };

    let errHandler = err => {
      res.status(400).send(`${err}`);
    };

    db(qsql, handler, errHandler);
  };

  let router = express.Router();

  router.use(bodyParser.json()); // support json encoded bodies
  router.use(
    bodyParser.urlencoded({
      extended: true
    })
  ); // support encoded bodies

  router.get("/", (req, res) => {
    res.send("hello draft management!");
  });

  router.get("/all", (req, res) => {
    let qsql = `select * from proposal.draft_proposal`;
    handler(res, qsql);
  });

  router.get("/export", (req, res) => {
    var qsql = "select * from proposal.draft_proposal";
    var handler = recordset => {
      var nodeExcel = require("excel-export");
      var conf = {};
      conf.cols = [
        {
          caption: "proposal_id",
          type: "number",
          width: 3
        },
        {
          caption: "proposal_title",
          type: "string",
          width: 50
        },
        {
          caption: "proposal_idea",
          type: "string",
          width: 50
        },
        {
          caption: "proposal_location",
          type: "string",
          width: 50
        },
        {
          caption: "proposal_latitude",
          type: "number",
          width: 10
        },
        {
          caption: "proposal_longitude",
          type: "number",
          width: 10
        }
      ];

      let rows = recordset["recordset"];
      let arr = [];
      for (var i = 0; i < rows.length; i++) {
        let row = rows[i];
        // console.log(row["proposal_longitude"]);
        let a = [
          row["draft_id"],
          row["proposal_title"],
          row["proposal_idea"],
          row["project_location"],
          row["proposal_latitude"],
          row["proposal_longitude"]
        ];
        arr.push(a);
      }
      conf.rows = arr;
      var result = nodeExcel.execute(conf);
      res.setHeader("Content-Type", "application/vnd.openxmlformates");
      res.setHeader(
        "Content-Disposition",
        "attachment;filename=" + "drafts.xlsx"
      );
      res.end(result, "binary");
      //   console.log(recordset);
    };

    db(qsql, handler);
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

  router.get("/:id", (req, res) => {
    let qsql = `select * from proposal.draft_proposal where draft_id='${
      req.params.id
    }'`;
    handler(res, qsql);
  });

  return router;
};
