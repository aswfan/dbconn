"use strict";
const DBAddr = process.env.DBADDR || "db:1433";

const sql = require("mssql");
const config = {
  userName: "SA",
  password: "GoTeam2018!",
  server: DBAddr,
  database: "YVYC",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const pool = new sql.ConnectionPool(config);

pool.connect(err => {
  if (!err) {
    console.log(`Error:\n${err.message}`);
  }
  const request = new sql.Request();
  request.multiple = true;

  request.query("select * from proposal.draft_proposal", (err, data) => {
    if (!err) {
      console.log(`Error:\n${err.message}`);
    }

    // result = Object.keys(recordset[0]).map(function(k) {
    //   return [k, recordset[0][k]];
    // });
    console.log(data.output);
  });
});
