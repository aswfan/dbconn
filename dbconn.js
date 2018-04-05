"use strict";

const DBAddr = "bulubulu.ischool.uw.edu";

const sql = require("mssql");
const config = {
  user: "SA",
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

// var qsql = "select * from proposal.draft_proposal";
// var handler = recordset => {
//   console.log(recordset);
// };

module.exports = (qsql, handler) => {
  pool
    .connect()
    .then(() => {
      const request = new sql.Request(pool);
      request.multiple = true;

      request
        .query(qsql)
        .then(handler)
        .then(() => {
          pool.close();
        })
        .catch(err => {
          console.log(err.message);
        });
    })
    .catch(err => {
      console.log(err.message);
      pool.close();
    });
};
