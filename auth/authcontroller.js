"use strict";

let express = require("express");
let router = express.Router();
let bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var User = require("../User");

let jwt = require("jsonwebtoken");
let bcryt = require("bcryptjs");
let secret = "supersecret";

router.post("/register", (req, res) => {
  let hashedPassword = bcryt.hashSync(req.body.password, 8);
});
