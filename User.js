"use strict";

let query = require("./dbconn").query;
var exports = (module.exports = {});

exports.getAllUsers = () => {
  let qsql = "select * from user_info.user_table";

  let handler = recordset => {
    console.log(recordset);
  };

  query(qsql, handler);
};

exports.addUser = (username, phone, email, password) => {
  let qsql = `INSERT INTO user_info.user_table(account_name, user_phone_number, user_email, user_password) VALUES('${username}', ${phone}, '${email}', '${password})`;

  let handler = recordset => {
    console.log(recordset);
  };

  query(qsql, handler);
};
