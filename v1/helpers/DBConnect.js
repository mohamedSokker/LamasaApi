const sql = require("mssql");

const config = require("../config/config");

const DBConnect = async () => {
  try {
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    return pool;
  } catch (error) {
    console.log(error.message);
    throw new Error(`Failed To Connect To DB`);
  }
};

module.exports = { DBConnect };
