"use strict";

const DBAddr = process.env.DBADDR || "db:1433";

const PORT = 8080;
const HOST = "";

const express = require("express");
const app = express();
const router = express.Router();

app.get("/", (req, res) => {
  res.send("hello index!");
});

const usermgt = require("./usermgt");
app.use("/usr", usermgt());

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.set("Content-Type", "text/plain");
  res.send(err.message);
});

app.listen(PORT, HOST);
console.log(`listening on http://${HOST}:${PORT}...`);
