const { DBConnect } = require("./DBConnect");

const getData = async (query) => {
  const DB = await DBConnect();
  try {
    const result = await DB.query(query);
    await DB.close();
    return result;
  } catch (error) {
    throw new Error(error.message);
  } finally {
  }
};

module.exports = { getData };
