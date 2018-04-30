"use strict";

const express = require("express");

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
      res.sendStatus(201);
    };

    let errHandler = err => {
      res.status(400).send(err);
    };

    db(qsql, postHandler, errHandler);
  };

  let router = express.Router();

  router.get("/", (req, res) => {
    res.send("hello vote management!");
  });
  // post user's vote on proposal
  // need editing
  router.post("/:uid&:pid", (req, res) => {
    let qsql = `insert into user_info.vote (user_system_id, proposal_id) VALUES (${
      req.params.uid
      }, '${req.params.pid}')`;
    postHandler(res, qsql);
  });

  router.get("/exportVotes", (req, res) => {
    let qsql = "select * from user_info.vote";
    //getHandler(res, qsql);
    var handler = recordset => {
      var nodeExcel = require("excel-export");
      var conf = {};
      conf.cols = [
        {
          caption: "user_system_id",
          type: "number",
          width: 40
        },
        {
          caption: "proposal_id",
          type: "string",
          width: 40
        }
      ];

      let rows = recordset["recordset"];
      let arr = [];
      for (var i = 0; i < rows.length; i++) {
        let row = rows[i];
        // console.log(row["proposal_longitude"]);
        let a = [
          row["user_system_id"],
          row["proposal_id"],
        ];
        arr.push(a);
      }
      conf.rows = arr;
      var result = nodeExcel.execute(conf);
      res.setHeader("Content-Type", "application/vnd.openxmlformates");
      res.setHeader(
        "Content-Disposition",
        "attachment;filename=" + "RawVotes.xlsx"
      );
      res.end(result, "binary");
      //   console.log(recordset);
    };

    db(qsql, handler);
  });

  // get proposal's aggregation vote
  router.get("/agg/:pid", (req, res) => {
    let qsql = `SELECT proposal_id, COUNT(*) as vote FROM user_info.vote WHERE proposal_id='${
      req.params.pid
      }' GROUP BY proposal_id`;
    getHandler(res, qsql);
  });

  // get all proposals' aggregation votes
  router.get("/aggAll", (req, res) => {
    let qsql = `SELECT proposal_id, COUNT(*) AS vote FROM user_info.vote GROUP BY proposal_id`;
    getHandler(res, qsql);
  });

  // check proposals the user has voted
  router.get("/check/:uid", (req, res) => {
    let qsql = `SELECT proposal_id FROM user_info.vote WHERE user_system_id=${
      req.params.uid
      }`;
    getHandler(res, qsql);
  });

  router.get("/export", (req, res) => {
    let qsql = `SELECT proposal_id, COUNT(*) AS vote FROM user_info.vote GROUP BY proposal_id`;
    db(qsql, (recordset) => {
      let p_g = recordset["recordset"];
      //console.log(p_g);
      let qs = `BEGIN `
      for (let p of p_g) {
        //console.log(p.proposal_id);
        //console.log(p.vote);

        qs += `UPDATE stage.stage3 SET score_by_vote=${p.vote} WHERE proposal_id='${p.proposal_id}' ;`
      }
      qs += ` SELECT 
      stage.stage3.score_by_vote,
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
      FROM stage.stage3 JOIN proposal.proposal_final ON stage.stage3.proposal_id=proposal.proposal_final.proposal_id
      ORDER BY stage.stage3.score_by_vote DESC; END`

      let handler = data => {
        let nodeExcel = require("excel-export");
        let conf = {};
        conf.cols = [
          {
            caption: "score_by_vote",
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
        //console.log(rows);
        let arr = [];
        for (var i = 0; i < rows.length; i++) {
          let row = rows[i];
          let a = [
            row["score_by_vote"],
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
          "attachment;filename=" + "votes.xlsx"
        );
        res.end(result, "binary");
      };

      db(qs, handler, (err) => {
        res.status(400).send(err);
      });
    });
  });

  return router;
};
