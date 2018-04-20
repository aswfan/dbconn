"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = db => {
  let getHandler = (res, qsql) => {
    let getHandler = recordset => {
      //   console.log(recordset);
      res.json({ data: recordset["recordset"] });
    };

    let errHandler = err => {
      res.status(400).send(`${err}`);
    };

    db(qsql, getHandler, errHandler);
  };

  let postHandler = (res, qsql) => {
    let postHandler = recordset => {
      //   console.log(recordset);
      res.sendStatus(202);
    };

    let errHandler = err => {
      res.status(400).send(err);
    };

    db(qsql, postHandler, errHandler);
  };

  let router = express.Router();

  router.use(bodyParser.json()); // support json encoded bodies
  router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  // get user's grade on proposal
  router.get("/:uid&:pid", (req, res) => {
    let qsql = `select * from user_info.grade where user_system_id=${
      req.params.uid
    }and proposal_id=${req.params.pid}`;
    getHandler(res, qsql);
  });

  // post user's grade on proposal
  router.post("/:uid&:pid", (req, res) => {
    let qsql = `insert into user_info.grade (user_system_id, proposal_id, grade_Need_at_location, grade_Community_Benefit, grade_final) VALUES (${
      req.params.uid
    }, ${req.params.pid}, ${req.body.grade_Need_at_location}, ${
      req.body.grade_Community_Benefit
    }, ${req.body.grade_Community_Benefit + req.body.grade_Need_at_location})`;
    postHandler(res, qsql);
  });

  // get proposal's aggregation grade
  router.get("/agg/:pid", (req, res) => {
    let qsql = `SELECT SUM(grade_final) AS grade FROM user_info.grade WHERE proposal_id=${
      req.params.pid
    } GROUP BY proposal_id`;

    getHandler(res, qsql);
  });

  router.get("/aggAll", (req, res) => {
    let qsql = `SELECT proposal_id, SUM(grade_final) AS grade FROM user_info.grade GROUP BY proposal_id`;
    getHandler(res, qsql);
  });

  router.get("/export", (req, res) => {
    let qsql = `SELECT proposal_id, SUM(grade_final) AS grade FROM user_info.grade GROUP BY proposal_id`;
    db(qsql, (recordset) => {
      let p_g = recordset["recordset"];
      let  qs = `BEGIN `
      for (let p of p_g) {
        qs += `UPDATE stage.stage2 SET grade_final=${p.grade} WHERE proposal_id='${p.proposal_id}'; `
      }
      qs += ` SELECT 
      stage.stage2.grade_final,
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
      FROM stage.stage2 JOIN proposal.proposal_final ON stage.stage2.proposal_id=proposal.proposal_final.proposal_id
      ORDER BY stage.stage2.grade_final DESC; END`

      let handler = data => {
        let nodeExcel = require("excel-export");
        let conf = {};
        conf.cols = [
          {
            caption: "grade_final",
            type: "number",
            width: 30
          },
          {
            caption: "proposal_id",
            type: "number",
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
  
        let rows = data["recordset"];
        let arr = [];
        for (var i = 0; i < rows.length; i++) {
          let row = rows[i];
          let a = [
            row["grade_final"],
            row["proposal_id"],
            row["final_proposal_title"],
            row["final_project_location"],
            row["cost"],
            row["final_proposal_idea"],
            row["proposal_need"],
            row["final_proposal_latitude"],
            row["final_proposal_longitude"],
            row["project_type"],
            row["department"],
            row["who_benefits"],
            row["council_district"],
            row["neihborhood"],
          ];
          arr.push(a);
        }
        conf.rows = arr;
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Type", "application/vnd.openxmlformates");
        res.setHeader(
          "Content-Disposition",
          "attachment;filename=" + "grades.xlsx"
        );
        res.end(result, "binary");
      };
  
      db(qs, handler);
    });
  });

  // clean table user_info.grade
  router.post("/clean", (req, res) => {
    let qsql = `DELETE FROM user_info.grade`;
    postHandler(res, qsql);
  });

  // check proposals the user has graded
  router.get("/check/:uid", (req, res) => {
    let qsql = `SELECT proposal_id FROM user_info.grade WHERE user_system_id=${
      req.params.uid
    }`;
    getHandler(res, qsql);
  });

  return router;
};
