"use strict";

const express = require("express");

const PORT = 80;
const HOST = "";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World\n");
});

app.listen(PORT, HOST);
console.log(`listening on http://${HOST}:${PORT}...`);
