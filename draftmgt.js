"use strict";

const express = require("express");

module.exports = db => {
  let router = express.Router();
  router.get("/", (req, res) => {
    res.send("hello draft management!");
  });

  router.get("/all", (req, res) => {
    var qsql = "select * from proposal.draft_proposal";
    var handler = recordset => {
      res.send(recordset["recordsets"]);
    };

    db(qsql, handler);

    // res.send(`get all drafts!`);
  });
  return router;
};
