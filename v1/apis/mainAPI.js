const { getAllData } = require("../services/mainService");
// const { migrateDate } = require("../controllers/web/Migration/handleAvCalc");
// const { createTables } = require("../controllers/web/Migration/createTables");

const { UsersSchema } = require("../schemas/Users/schema");

const route = require("../routes/mainRoute");
const tables = [{ name: "Users", schema: UsersSchema }];

const addVariables = (table, schema) => {
  return (req, res, next) => {
    req.table = table;
    req.schema = schema;
    next();
  };
};

const tablesV1EndPoint = async (app) => {
  try {
    tables.forEach(async (item) => {
      app.use(
        `/api/v1/${item.name}`,
        addVariables(item.name, item.schema),
        route
      );
      await getAllData(item.name);
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { tablesV1EndPoint };
