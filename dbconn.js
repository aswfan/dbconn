// const sql = require("mssql");
// const config = {
//   user: "SA",
//   password: "GoTeam2018!",
//   server: DBAddr,
//   database: "YVYC",
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000
//   }
// };

// const pool = new sql.ConnectionPool(config);

// app.get("/", (req, res) => {
//   pool.connect(err => {
//     if (err) {
//       res.set("Content-Type", "text/plain");
//       res.send(`Error:\n${err.message}`);
//     }
//     const request = new sql.Request(pool);
//     request.multiple = true;

//     request.query("select * from proposal.draft_proposal", (err, recordset) => {
//       res.set("Content-Type", "text/plain");
//       if (err) {
//         res.send(`Error:\n${err.message}`);
//       }

//       //parse recordset
//       //   result = Object.keys(recordset[0]).map(function(k) {
//       //   return [k, recordset[0][k]];
//       // });

//       res.send(recordset);
//     });
//   });
// });
