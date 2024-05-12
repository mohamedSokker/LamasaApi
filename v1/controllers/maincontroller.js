const {
  // createTable,
  // getAllData,
  getOneData,
  addData,
  addMany,
  updateData,
  updateMany,
  deleteData,
  deleteMany,
} = require("../services/mainService");
const JSONStream = require("JSONStream");

// const { getAllData } = require("../../../services/mainService");
const { getData } = require("../helpers/getData");
const { model } = require("../model/mainModel");

const getAllTable = async (req, res) => {
  try {
    // const data = await getAllData(req.table);
    const memoryUsageBefore = process.memoryUsage().rss;

    const jsonStream = JSONStream.stringify("[\n", "\n,\n", "\n]\n", 1024);

    // Pipe the large JSON object to the JSONStream serializer
    jsonStream.pipe(res);

    if (model[req.table]) {
      // Push the large JSON object into the JSONStream serializer
      model[req.table].forEach((item) => {
        jsonStream.write(item);
      });

      // End the JSONStream serializer
      jsonStream.end();
    } else {
      getData(`SELECT * FROM ${req.table}`).then((result) => {
        result.recordsets[0].forEach((item) => {
          jsonStream.write(item);
        });

        // End the JSONStream serializer
        jsonStream.end();
      });
    }

    const memoryUsageAfter = process.memoryUsage().rss;
    const memoryDiff = memoryUsageAfter - memoryUsageBefore;

    console.log(`${req.table} b ${memoryUsageBefore / (1024 * 1024)} MB`);
    console.log(`${req.table} a ${memoryDiff / (1024 * 1024)} MB`);
    // return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOneTable = async (req, res) => {
  try {
    console.log(req.params.id);
    const data = await getOneData(req.params.id, req.table);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addOneTable = async (req, res) => {
  try {
    const data = await addData(req.body, req.table, req.schema);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addManyTable = async (req, res) => {
  try {
    const data = await addMany(req.body, req.table, req.schema);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateOneTable = async (req, res) => {
  try {
    const data = await updateData(
      req.body,
      req.params.id,
      req.table,
      req.schema
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateManyTable = async (req, res) => {
  try {
    const data = await updateMany(req.body, req.table, req.schema);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteOneTable = async (req, res) => {
  try {
    const data = await deleteData(req.params.id, req.table);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteManyTable = async (req, res) => {
  try {
    const data = await deleteMany(req.body.ids, req.table);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTable,
  getOneTable,
  addOneTable,
  addManyTable,
  updateOneTable,
  updateManyTable,
  deleteOneTable,
  deleteManyTable,
};
