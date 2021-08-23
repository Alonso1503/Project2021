const mysql = require("mysql");
const { database } = require("./keys");
const { promisify } = require("util");

const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION LOST");
    }
    if (err.code === "ERR_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TOO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE CONNECTION REFUSED");
    }
  }
  if (connection) connection.release();
  console.log("DB CONNECTED");
  return;
});
pool.query = promisify(pool.query);

module.exports = pool;
