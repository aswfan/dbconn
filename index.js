"use strict";

const PORT = 8080;
const HOST = "";

const express = require("express");
const app = express();

const db = require("./dbconn");

app.get("/", (req, res) => {
  res.send("hello index!");
});

const draftmgt = require("./draftmgt");
app.use("/draft", draftmgt(db));

const usermgt = require("./usermgt");
app.use("/usr", usermgt());

const grade = require("./grade");
app.use("/grade", grade(db));

const vote = require("./vote");
app.use("/vote", vote(db));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.set("Content-Type", "text/plain");
  res.send(err.message);
});

app.listen(PORT, HOST);
console.log(`listening on http://${HOST}:${PORT}...`);
