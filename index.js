"use strict";

const PORT = 8080;
const HOST = "";

const express = require("express");
const app = express();

const cors = require("cors");

const db = require("./dbconn");

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello index!");
});

const auth = require("./auth");
app.use("/auth", auth(db));

const draftmgt = require("./DraftMgmt");
app.use("/draft", draftmgt(db));

const usermgt = require("./UserMgmt");
app.use("/user", usermgt());

const finalmgt = require("./FinalMgmt");
app.use("/final", finalmgt(db));

const grade = require("./GradeMgmt");
app.use("/grade", grade(db));

const vote = require("./VoteMgmt");
app.use("/vote", vote(db));

app.listen(PORT, HOST);
console.log(`listening on http://${HOST}:${PORT}...`);
