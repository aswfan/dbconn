"use strict";

let express = require("express");
let router = express.Router();
let bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
