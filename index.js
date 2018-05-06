"use strict";

const PORT = 8080;
const HOST = "";

const express = require("express");
const app = express();

const db = require("./js/dbconn");

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello index!");
});

const auth = require("./js/auth");
app.use("/auth", auth(db));

const draftmgt = require("./js/DraftMgmt");
app.use("/draft", draftmgt(db));

const usermgt = require("./js/UserMgmt");
app.use("/user", usermgt(db));

const finalmgt = require("./js/FinalMgmt");
app.use("/final", finalmgt(db));

const phasemgt = require("./js/PhaseMgmt");
app.use("/phase", phasemgt(db));

const stagemgt = require("./js/StageMgmt");
app.use("/stage", stagemgt(db));

const grade = require("./js/GradeMgmt");
app.use("/grade", grade(db));

const vote = require("./js/VoteMgmt");
app.use("/vote", vote(db));

app.listen(PORT, HOST);
console.log(`listening on http://${HOST}:${PORT}...`);
