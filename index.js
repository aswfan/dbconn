"use strict";

const express = require("express");
const DBAddr = process.env.DBADDR || "db:1433";

const PORT = 80;
const HOST = "";

const app = express();

const sql = require("mssql");
const config = {
  user: "SA",
  password: "GoTeam2018!",
  server: DBAddr,
  database: "YVYC",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const pool = new sql.ConnectionPool(config);

app.get("/", (req, res) => {
  pool.connect(err => {
    if (err) {
      res.set("Content-Type", "text/plain");
      res.send(`Error:\n${err.message}`);
    }
    const request = new sql.Request(pool);
    request.multiple = true;

    request.query("select * from proposal.draft_proposal", (err, recordset) => {
      res.set("Content-Type", "text/plain");
      if (err) {
        res.send(`Error:\n${err.message}`);
      }
      res.send(recordset);
    });
  });
});

// const dbconn = require("./dbconn");
// app.use(dbconn({ connection }));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.set("Content-Type", "text/plain");
  res.send(err.message);
});

app.listen(PORT, HOST);
console.log(`listening on http://${HOST}:${PORT}...`);
