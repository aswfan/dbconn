"use strcit";

const express = require("express");

module.exports = dbsession => {
  if (!dbsession) {
    throw new Error("db session required!");
  }

  let router = express.Router();

  router.get("/drafts", (req, res) => {
    connection.on("connect", err => {
      console.log("connected!");
      executeStatement(res);
    });
  });

  var Request = require("tedious").Request;
  var TYPES = require("tedious").TYPES;

  function executeStatement(res) {
    request = new Request("select * from proposal.draft_proposal", function(
      err
    ) {
      if (err) {
        console.log(err);
      }
    });
    var result = "";
    request.on("row", function(columns) {
      columns.forEach(function(column) {
        if (column.value === null) {
          console.log("NULL");
        } else {
          result += column.value + " ";
        }
      });
      //   console.log(result);
      //   result = "";
    });
    res.json({ result: result });

    request.on("done", function(rowCount, more) {
      console.log(rowCount + " rows returned");
    });
    connection.execSql(request);
  }
};
