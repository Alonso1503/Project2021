const mariadb = require("mariadb");

mariadb
  .createConnection({ host: "localhost", user: "root", password: "MaXiMun" })
  .then((conn) => {
    conn
      .query("SHOW CREATE TABLE `emergencias`.`persona`")
      .then((rows) => {
        console.log(rows); // [{ "1": 1 }]
        conn.end();
      })
      .catch((err) => {
        console.log(error);
      });
  })
  .catch((err) => {
    console.log(error);
  });
