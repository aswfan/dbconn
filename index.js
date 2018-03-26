"use strict";

const express = require("express");
const DBAddr = process.env.DBADDR || "sqlserver:1433";

const PORT = 80;
const HOST = "";

const Connection = require("tedious").Connection;
const config = {
  userName: "SA",
  password: "GoTeam2018!",
  server: DBAddr,
  options: {
    encrypt: true,
    database: "YVYC"
  }
};

var connection = new Connection(config);

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World\n");
});

const dbconn = require("./dbconn");
app.use(dbconn({ connection }));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.set("Content-Type", "text/plain");
  res.send(err.message);
});

app.listen(PORT, HOST);
console.log(`listening on http://${HOST}:${PORT}...`);
