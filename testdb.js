"use strict";
const DBAddr = process.env.DBADDR || "db:1433";

const sql = require("mssql");
const config = {
  user: "sa",
  password: "GoTeam2018!",
  server: DBAddr,
  database: "YVYC"
};

// const pool = new sql.ConnectionPool(config);

sql.connect(config, function(err) {
  if (err) console.log(err);

  // create Request object
  var request = new sql.Request();

  // query to the database and get the data
  request.query("select * from proposal.draft_proposal", function(
    err,
    recordset
  ) {
    if (err) console.log(err);

    // send data as a response
    console.log(recordset);
  });
});

// pool.connect(err => {
//   if (!err) {
//     console.log(`Error:\n${err.message}`);
//   }
//   const request = new sql.Request();
//   request.multiple = true;

//   request.query("select * from proposal.draft_proposal", (err, data) => {
//     if (!err) {
//       console.log(`Error:\n${err.message}`);
//     }

//     // result = Object.keys(recordset[0]).map(function(k) {
//     //   return [k, recordset[0][k]];
//     // });
//     console.log(data.output);
//   });
// });
