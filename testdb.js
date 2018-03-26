"use strict";
const DBAddr = process.env.DBADDR || "db:1433";

var Connection = require("tedious").Connection;
const config = {
  userName: "SA",
  password: "GoTeam2018!",
  server: DBAddr,
  options: {
    database: "YVYC"
  }
};
var connection = new Connection(config);
connection.on("connect", function(err) {
  // If no error, then good to proceed.
  console.log("Connected");
});
