"use strict";

const express = require("express");
const DBAddr = process.env.DBADDR || "db:1433";

const PORT = 80;
const HOST = "";

const sql = require("mssql");
const config = {
  userName: "SA",
  password: "GoTeam2018!",
  server: DBAddr,
  database: "YVYC",
  port: 1433
};

var conn = new sql.Connection(config);

const app = express();

app.get("/", (req, res) => {
  conn
    .connect()
    .then(() => {
      var dbreq = new sql.Request(conn);
      res.set("Content-Type", "text/plain");
      dbreq
        .query("select * from proposal.draft_proposal")
        .then(records => {
          res.send(`Hello World!\n${records}`);
          dbconn.close();
        })
        .catch(err => {
          console.log(err.stack);
          res.send(err.message);
          dbconn.close();
        });
    })
    .catch(err => {
      console.log(err.stack);
      res.send(err.message);
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
