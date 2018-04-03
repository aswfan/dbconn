"use strict";

const express = require("express");

module.exports = () => {
  let router = express.Router();
  router.get("/usr", (req, res) => {
    res.send("hello user management!");
  });

  router.get("/:id", (req, res) => {
    res.send(`hello ${req.params.id}!`);
  });
  return router;
};
