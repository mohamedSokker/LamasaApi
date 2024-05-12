const events = require("events");
const eventEmitter = new events.EventEmitter();

const { model } = require("../model/mainModel");
const { getData } = require("../../v1/helpers/getData");
// const { io } = require("../socket/socket");

const getMany = async (Number, table) => {
  try {
    const query = `SELECT TOP ${Number} * FROM ${table} ORDER BY ID DESC`;
    return (await getData(query)).recordsets[0];
  } catch (error) {
    throw new Error(error);
  }
};

eventEmitter.on("addedOne", async ({ count, table }) => {
  const addedData = await getMany(count, table);
  model[table] = model[table].concat(addedData);
  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("addedMany", async ({ data, table }) => {
  const addedData = await getMany(data, table);
  const sortedAddedData = addedData.sort((a, b) => Number(a.ID) - Number(b.ID));
  model[table] = model[table].concat(sortedAddedData);
  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("updatedOne", ({ data, table }) => {
  const updatedData = data;
  const targetItem = model[table].find(
    (item) => Number(item.ID) === Number(data.ID)
  );
  const index = model[table].findIndex(
    (item) => Number(item.ID) === Number(data.ID)
  );
  if (targetItem) {
    model[table][index] = { ...targetItem, ...updatedData };
  } else {
    console.log("Item not found.");
  }
  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("updatedMany", ({ data, table }) => {
  const updatedData = data;
  const targetData = model[table].map((originalItem) => {
    let replacement = updatedData.find(
      (replaceItem) => replaceItem.ID === originalItem.ID
    );

    return replacement ? { ...originalItem, ...replacement } : originalItem;
  });
  console.log(targetData[targetData.length - 1]);
  model[table] = targetData;
  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("deletedOne", ({ id, table }) => {
  model[table] = model[table].filter((d) => Number(d.ID) !== Number(id));
  //   io.emit("appDataUpdate", model[table]);
});

eventEmitter.on("deletedMany", ({ ids, table }) => {
  model[table] = model[table].filter((d) => !ids.includes(d.ID));
  //   io.emit("appDataUpdate", model[table]);
});

module.exports = { eventEmitter };
