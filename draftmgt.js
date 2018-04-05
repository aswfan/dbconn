"use strict";

const express = require("express");

module.exports = db => {
  let handler = (res, qsql) => {
    let handler = recordset => {
      //   console.log(recordset);
      res.json({ data: recordset["recordset"] });
    };
    db(qsql, handler);
  };

  let router = express.Router();
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

  return router;
};
