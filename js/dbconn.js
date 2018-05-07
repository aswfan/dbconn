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
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// var qsql = "select * from proposal.draft_proposal";
// var handler = recordset => {
//   console.log(recordset);
// };
// exports.conn = pool;

module.exports = (qsql, handler, errHandler, callback) => {
  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      const request = new sql.Request(pool);
      request.multiple = true;

      request
        .query(qsql)
        .then(handler)
        .catch(err => {
          errHandler(err);
        });
    })
    .then(() => {
      if(callback) {
        callback();
      }
    })
    .catch(err => {
      errHandler(err);
    });
};
