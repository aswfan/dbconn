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

let username = "yyfan1";
let pwd = "123";

var qsql = `BEGIN
	IF NOT EXISTS (SELECT * FROM user_info.user_table 
					WHERE account_name = '${username}')
	BEGIN
		INSERT INTO user_info.user_table (account_name, user_password)
		VALUES ('${username}', '${pwd}')
	END
END`;
var handler = recordset => {
  console.log(recordset["rowsAffected"] == 0);
  console.log(recordset);
};

var errhandler = recordset => {
  console.log("rowsAffected");
};
exports.conn = pool;

function connect(qsql, handler, errHandler) {
  pool
    .connect()
    .then(() => {
      const request = new sql.Request(pool);
      request.multiple = true;

      request
        .query(qsql)
        .then(handler)
        .catch(err => {
          errHandler(err);
        })
        .then(() => {
          pool.close();
        });
    })
    .catch(err => {
      errHandler(err);
      pool.close();
    });
}

connect(qsql, handler, errhandler);
