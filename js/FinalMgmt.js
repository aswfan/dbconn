"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

let Storage = multer.diskStorage({
  destination: function (req, file, callback) {
      callback(null, "./proposals");
  },
  filename: function (req, file, callback) {
      callback(null, "ProposalsAfterProcess.xlsx");
  }
});

let upload = multer({ storage: Storage }).array("excelUploader", 3); //Field name and max count

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

  router.get("/export", (req, res) => {
    let qsql = "select * from proposal.proposal_final";
    //getHandler(res, qsql);
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
        "attachment;filename=" + "final_proposals.xlsx"
      );
      res.end(result, "binary");
      //   console.log(recordset);
    };

    db(qsql, exportHandler, err => {
      res.status(400).send(`${err}`);
    });
  });

  router.post("/import", (req, res) => {
    upload(req, res, err => {
      if (err) {
          return res.status(400).send(`Something went wrong:\n${err}`);
      }
      importExcelToDB()
        .then(data => { console.log(`Success import proposal(id=${data['proposal_id']})`)})
        .catch(err => { console.log(`${err}`)});
      return res.status(200).send("File uploaded sucessfully and is being importing to DB...");
    });
  });

  function importExcelToDB() {
    return new Promise((resolve, reject) => {
      let XLSX = require('xlsx');
      let proposals;
      try {
        let workbook = XLSX.readFile('./proposals/ProposalsAfterProcess.xlsx');
        let sheet_name_list = workbook.SheetNames;
        proposals = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      } catch(err) {
        return reject(err);
      }
      if(proposals) {
        proposals.forEach(item => {
          let qsql = `INSERT INTO proposal.proposal_final(
                        proposal_id
                        , final_proposal_title
                        , final_proposal_idea
                        , final_project_location
                        , cost
                        , proposal_need
                        , final_proposal_latitude
                        , final_proposal_longitude
                        , project_type
                        , department
                        , who_benefits
                        , council_district
                        , neihborhood
                      ) VALUES(
                        '${item['proposal_id']}'
                        , '${item['proposal_title']}'
                        , '${item['proposal_idea']}'
                        , '${item['project_location']}'
                        , ${item['cost']}
                        , '${item['proposal_need']}'
                        , ${item['proposal_latitude']}
                        , ${item['proposal_longitude']}
                        , '${item['project_type']}'
                        , '${item['department']}'
                        , '${item['who_benefits']}'
                        , ${item['council_district']}
                        , '${item['neihborhood']}'
                      )`;
          // console.log(qsql);
          let handler = recordset => {
            if (recordset["rowsAffected"] == 0) {
              return reject(`Error: fail to insert proposal(id=${item['proposal_id']})`)
            }
            return resolve(item);
          };
          let errhandler = err => {
            return reject(err);
          };
          db(qsql, handler, errhandler);
        });
      } else {
        reject('Error: no record found!');
      }
    });
  }

  // get final proposal info
  router.get("/:pid", (req, res) => {
    let qsql = `SELECT * from proposal.proposal_final WHERE proposal_id='${
      req.params.pid
      }'`;

    handler(res, qsql);
  });

  return router;
};
