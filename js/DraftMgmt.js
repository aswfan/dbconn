"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const verifyToken = require("./VerifyToken");

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

  let postHandler = (res, qsql) => {
    let handler = recordset => {
      //   console.log(recordset);
      res.sendStatus(202);
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
    let qsql = `select * from proposal.draft_proposal order by LEN(draft_id), draft_id`;
    handler(res, qsql);
  });

  router.get("/export", (req, res) => {
    var qsql = "select * from proposal.draft_proposal";
    var exportHandler = recordset => {
      var nodeExcel = require("excel-export");
      var conf = {};
      conf.cols = [
        {
          caption: "proposal_id",
          type: "string",
          width: 30
        },
        {
          caption: "proposal_title",
          type: "string",
          width: 50
        },
        {
          caption: "project_location",
          type: "string",
          width: 50
        },
        {
          caption: "cost",
          type: "number",
          width: 50
        },
        {
          caption: "proposal_idea",
          type: "string",
          width: 10
        },
        {
          caption: "proposal_need",
          type: "string",
          width: 10
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
        },
        {
          caption: "project_type",
          type: "string",
          width: 10
        },
        {
          caption: "department",
          type: "string",
          width: 10
        },
        {
          caption: "who_benefits",
          type: "string",
          width: 10
        },
        {
          caption: "council_district",
          type: "number",
          width: 10
        },
        {
          caption: "neihborhood",
          type: "string",
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
          row["project_location"],
          "",
          row["proposal_idea"],
          "",
          row["proposal_latitude"],
          row["proposal_longitude"],
          "",
          "",
          "",
          "",
          ""
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

    db(qsql, exportHandler, err => {
      res.status(400).send(`${err}`);
    });
  });

  let escape = function (str) {
    return str.replace(/'/g, "\'\'");
  }

  router.post("/add", (req, res) => {

    let draft_id = req.body.draft_id;
    let proposal_title = escape(req.body.proposal_title);
    let proposal_idea = escape(req.body.proposal_idea);
    let proposal_latitude = req.body.proposal_latitude;
    let proposal_longitude = req.body.proposal_longitude;
    let project_location = escape(req.body.project_location);

    let qsql = `insert into proposal.draft_proposal (draft_id, proposal_title, proposal_idea, proposal_latitude, proposal_longitude, project_location) values ('${draft_id}', '${proposal_title}', '${proposal_idea}', '${proposal_latitude}', '${proposal_longitude}', '${project_location}')`;

    postHandler(res, qsql);
  });

  router.post("/edit/:id", verifyToken, (req, res) => {

    let proposal_title = escape(req.body.proposal_title);
    let proposal_idea = escape(req.body.proposal_idea);
    let proposal_latitude = req.body.proposal_latitude;
    let proposal_longitude = req.body.proposal_longitude;
    let project_location = escape(req.body.project_location);

    let qsql = `UPDATE proposal.draft_proposal SET 
    proposal_title='${proposal_title}', 
    proposal_idea='${proposal_idea}', 
    proposal_latitude='${proposal_latitude}', 
    proposal_longitude='${proposal_longitude}', 
    project_location='${project_location}' 
    WHERE draft_id='${req.params.id}'`;

    postHandler(res, qsql);
  });

  router.post("/rm/:id", verifyToken, (req, res) => {
    let qsql = `DELETE FROM proposal.draft_proposal WHERE draft_id = 
    '${req.params.id}'`;
    postHandler(res, qsql);
  });

  router.get("/:id", (req, res) => {
    let qsql = `select * from proposal.draft_proposal where draft_id='${
      req.params.id
      }'`;
    handler(res, qsql);
  });

  return router;
};
