"use strict";

const express = require("express");

const selecthandler = recordset => {
  res.set("Content-Type", "text/plain");
  res.send(recordset["recordsets"]);
};

module.exports = db => {
  let router = express.Router();
  router.get("/", (req, res) => {
    res.send("hello draft management!");
  });

  router.get("/all", (req, res) => {
    var qsql = `select * from proposal.draft_proposal`;
    db(qsql, selecthandler);
  });

  router.get("/:id", (req, res) => {
    var qsql = `select * from proposal.draft_proposal where proposal_id=${
      req.params.id
    }`;
    db(qsql, selecthandler);
    // res.send(`hello ${req.params.id}!`);
  });

  return router;
};
