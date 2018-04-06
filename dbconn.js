"use strict";

var exports = (module.exports = {});

const DBAddr = process.env.DBADDR || "localhost";

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
exports.conn = pool;

exports.query = (qsql, handler) => {
  pool
    .connect()
    .then(() => {
      const request = new sql.Request(pool);
      request.multiple = true;

      request
        .query(qsql)
        .then(handler)
        .catch(err => {
          console.log(err.message);
        })
        .then(() => {
          pool.close();
        });
    })
    .catch(err => {
      console.log(err.message);
      pool.close();
    });
};
