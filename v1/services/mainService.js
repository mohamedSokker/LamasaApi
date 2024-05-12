const bcrypt = require("bcrypt");

const { getData } = require("../../v1/helpers/getData");
const { eventEmitter } = require("../subscribers/mainSubscriber");
const { model } = require("../model/mainModel");
// const { TestSchema } = require("./schema");
const {
  validateAddData,
  validateManyAdd,
  validateupdateData,
  validateManyUpdate,
} = require("../validations/mainValidation");
const { UsersSchema } = require("../schemas/Users/schema");
require("dotenv").config();

// const getDate = (date) => {
//   const dt = new Date(date);
//   dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
//   return dt.toISOString().slice(0, 16);
// };

const getTableData = async (table) => {
  try {
    const getquery = `SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('${table}')`;
    const data = (await getData(getquery)).recordsets[0];
    let result = {};
    data.map((d) => {
      result[d.name] = {};
    });
    console.log(result);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

// getTableData("Users");

const createTable = async (table, schema) => {
  try {
    let query = `CREATE TABLE ${table} (`;
    Object.keys(schema).map((item) => {
      query += `${item} ${schema[item].databaseType},`;
    });
    query = query.slice(0, -1);
    query += ")";
    await getData(query);
    return `Success`;
  } catch (error) {
    throw new Error(error);
  }
};

// createTable("Users", UsersSchema);

const getAllData = async (table) => {
  try {
    if (!model[table]) {
      console.log(`From Database`);
      const query = `SELECT * FROM ${table}`;
      getData(query).then((data) => {
        model[table] = data.recordsets[0];
        const size = Buffer.byteLength(JSON.stringify(model));
        const sizeKB = Buffer.byteLength(JSON.stringify(model)) / 1024;
        const sizeMB = sizeKB / 1024;
        console.log(
          `${size} byte`,
          `${sizeKB.toFixed(2)} KB`,
          `${sizeMB.toFixed(2)} MB`
        );
        console.log(table);
      });

      return model[table];
    } else {
      console.log(`From Model`);
      const size = Buffer.byteLength(JSON.stringify(model));
      const sizeKB = Buffer.byteLength(JSON.stringify(model)) / 1024;
      const sizeMB = sizeKB / 1024;
      console.log(
        `${size} byte`,
        `${sizeKB.toFixed(2)} KB`,
        `${sizeMB.toFixed(2)} MB`
      );
      return model[table];
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getOneData = async (id, table) => {
  try {
    if (!model[table]) {
      console.log(`One From Database`);
      const query = `SELECT * FROM ${table} WHERE ID = '${id}'`;
      const result = (await getData(query)).recordsets[0];
      return result;
    } else {
      console.log(`One From Model`);
      return model[table].filter((item) => item.ID === Number(id));
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getMany = async (Number, table) => {
  try {
    const query = `SELECT TOP ${Number} * FROM ${table} ORDER BY ID DESC`;
    return (await getData(query)).recordsets[0];
  } catch (error) {
    throw new Error(error);
  }
};

const addData = async (bodyData, table, schema) => {
  try {
    let query = `INSERT INTO ${table} VALUES ( `;
    const validation = validateAddData(bodyData, schema);
    if (validation) {
      const keysData = Object.keys(schema);
      for (let i = 0; i < keysData.length; i++) {
        if (keysData[i] === "Password") {
          query += `'${await bcrypt.hash(bodyData[keysData[i]], 10)}',`;
        } else if (keysData[i] !== "ID") {
          if (bodyData[keysData[i]] === null) {
            query += "NULL,";
          } else if (bodyData[keysData[i]] === "Date.Now") {
            query += `'${new Date().toISOString()}',`;
          } else {
            query += `'${bodyData[keysData[i]]}',`;
          }
        }
      }
      query = query.slice(0, -1);
      query += ") ";
      // console.log(query);
      const result = await getData(query);
      eventEmitter.emit("addedOne", { count: 1, table: table });
      return result.recordsets[0];
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const addDataQuery = async (bodyData, table, schema) => {
  try {
    let query = `INSERT INTO ${table} VALUES ( `;
    const validation = validateAddData(bodyData, schema);
    if (validation) {
      const keysData = Object.keys(bodyData);
      for (let i = 0; i < keysData.length; i++) {
        if (keysData[i] === "Password") {
          query += `'${await bcrypt.hash(bodyData[keysData[i]], 10)}',`;
        } else if (keysData[i] !== "ID") {
          if (bodyData[keysData[i]] === null) {
            query += "NULL,";
          } else if (bodyData[keysData[i]] === "Date.Now") {
            query += `'${new Date().toISOString()}',`;
          } else {
            query += `'${bodyData[keysData[i]]}',`;
          }
        }
      }
      query = query.slice(0, -1);
      query += ") ";
      return query;
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const addMany = async (data, table, schema) => {
  try {
    let query = ``;
    const validation = validateManyAdd(data, schema);
    if (validation) {
      data.map((bodyData) => {
        query += `INSERT INTO ${table} VALUES ( `;
        Object.keys(bodyData).map(async (item) => {
          if (item === "Password") {
            query += `'${await bcrypt.hash(bodyData[item], 10)}',`;
          } else if (item !== "ID") {
            if (bodyData[item] === null) {
              query += "NULL,";
            } else if (bodyData[item] === "Date.Now") {
              query += `'${new Date().toISOString()}',`;
            } else {
              query += `'${bodyData[item]}',`;
            }
          }
        });
        query = query.slice(0, -1);
        query += ") ";
      });
      // console.log(query);
      const result = await getData(query);

      eventEmitter.emit("addedMany", { data: data.length, table, table });
      return result.recordsets[0];
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const addManyQuery = async (data, table, schema) => {
  try {
    let query = ``;
    const validation = validateManyAdd(data, schema);
    if (validation) {
      data.map((bodyData) => {
        query += `INSERT INTO ${table} VALUES ( `;
        Object.keys(bodyData).map(async (item) => {
          if (item === "Password") {
            query += `'${await bcrypt.hash(bodyData[item], 10)}',`;
          } else if (item !== "ID") {
            if (bodyData[item] === null) {
              query += "NULL,";
            } else if (bodyData[item] === "Date.Now") {
              query += `'${new Date().toISOString()}',`;
            } else {
              query += `'${bodyData[item]}',`;
            }
          }
        });
        query = query.slice(0, -1);
        query += ") ";
      });
      return query;
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateData = async (bodyData, id, table, schema) => {
  try {
    let query = `UPDATE ${table} SET `;
    const validation = validateupdateData(bodyData, schema);
    const keysData = Object.keys(bodyData);
    let newBody = {};
    if (validation) {
      for (let i = 0; i < keysData.length; i++) {
        console.log(keysData[i]);
        if (keysData[i] === "Password") {
          newBody = {
            ...newBody,
            [keysData[i]]: await bcrypt.hash(bodyData[keysData[i]], 10),
          };
          console.log(`hits password`);
          query += `"${keysData[i]}" = '${await bcrypt.hash(
            bodyData[keysData[i]],
            10
          )}',`;
        } else if (keysData[i] !== "ID") {
          newBody = { ...newBody, [keysData[i]]: bodyData[keysData[i]] };
          if (bodyData[keysData[i]] === null) {
            query += `"${keysData[i]}" = NULL,`;
          } else if (bodyData[keysData[i]] === "Date.Now") {
            query += `"${keysData[i]}" = '${new Date().toISOString()}',`;
          } else {
            query += `"${keysData[i]}" = '${bodyData[keysData[i]]}',`;
          }
        }
      }
      query = query.slice(0, -1);
      query += ` WHERE ID = '${id}'`;
      // console.log(query);
      const result = await getData(query);
      eventEmitter.emit("updatedOne", {
        data: { ID: Number(id), ...newBody },
        table: table,
      });
      return result.recordsets[0];
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateDataQuery = async (bodyData, id, table, schema) => {
  try {
    let query = `UPDATE ${table} SET `;
    const validation = validateupdateData(bodyData, schema);
    if (validation) {
      Object.keys(bodyData).map(async (item) => {
        if (item === "Password") {
          query += `"${item}" = '${await bcrypt.hash(bodyData[item], 10)}',`;
        } else if (item !== "ID") {
          if (bodyData[item] === null) {
            query += `"${item}" = NULL,`;
          } else if (bodyData[item] === "Date.Now") {
            query += `"${item}" = '${new Date().toISOString()}',`;
          } else {
            query += `"${item}" = '${bodyData[item]}',`;
          }
        }
      });
      query = query.slice(0, -1);
      query += ` WHERE ID = '${id}'`;
      return query;
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateMany = async (data, table, schema) => {
  try {
    let query = ``;
    const validation = validateManyUpdate(data, schema);
    if (validation) {
      data.map((bodyData) => {
        query += ` UPDATE ${table} SET `;
        Object.keys(bodyData).map(async (item) => {
          if (item === "Password") {
            query += `"${item}" = '${await bcrypt.hash(bodyData[item], 10)}',`;
          } else if (item !== "ID") {
            if (bodyData[item] === null) {
              query += `"${item}" = NULL,`;
            } else if (bodyData[item] === "Date.Now") {
              query += `"${item}" = '${new Date().toISOString()}',`;
            } else {
              query += `"${item}" = '${bodyData[item]}',`;
            }
          }
        });
        query = query.slice(0, -1);
        query += ` WHERE ID = '${bodyData.ID}' `;
      });
      console.log(query);
      const result = await getData(query);

      eventEmitter.emit("updatedMany", { data: data, table: table });
      return result.recordsets[0];
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateManyQuery = async (data, table, schema) => {
  try {
    let query = ``;
    const validation = validateManyUpdate(data, schema);
    if (validation) {
      data.map((bodyData) => {
        query += ` UPDATE ${table} SET `;
        Object.keys(bodyData).map(async (item) => {
          if (item === "Password") {
            query += `"${item}" = '${await bcrypt.hash(bodyData[item], 10)}',`;
          } else if (item !== "ID") {
            if (bodyData[item] === null) {
              query += `"${item}" = NULL,`;
            } else if (bodyData[item] === "Date.Now") {
              query += `"${item}" = '${new Date().toISOString()}',`;
            } else {
              query += `"${item}" = '${bodyData[item]}',`;
            }
          }
        });
        query = query.slice(0, -1);
        query += ` WHERE ID = '${bodyData.ID}' `;
      });

      return query;
    } else {
      throw new Error(`Validation Failed`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteData = async (id, table) => {
  try {
    let query = `DELETE FROM ${table} WHERE ID = '${id}'`;
    const result = await getData(query);
    eventEmitter.emit("deletedOne", { id: id, table: table });
    return result.recordsets[0];
  } catch (error) {
    throw new Error(error);
  }
};

const deleteDataQuery = async (id, table) => {
  try {
    let query = `DELETE FROM ${table} WHERE ID = '${id}'`;
    return query;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMany = async (ids, table) => {
  try {
    let query = ``;
    ids.map((id) => {
      query += `DELETE FROM ${table} WHERE ID = '${id}' `;
    });
    const result = await getData(query);
    eventEmitter.emit("deletedMany", { ids: ids, table: table });
    return result.recordsets[0];
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyQuery = async (ids, table) => {
  try {
    let query = ``;
    ids.map((id) => {
      query += `DELETE FROM ${table} WHERE ID = '${id}' `;
    });
    return query;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createTable,
  getAllData,
  getOneData,
  addData,
  addDataQuery,
  addMany,
  addManyQuery,
  updateData,
  updateDataQuery,
  updateMany,
  updateManyQuery,
  deleteData,
  deleteDataQuery,
  deleteMany,
  deleteManyQuery,
};
