const express = require("express");
const router = express.Router();
const {
  getAllTable,
  getOneTable,
  addOneTable,
  addManyTable,
  updateOneTable,
  updateManyTable,
  deleteOneTable,
  deleteManyTable,
} = require("../controllers/maincontroller");

router.get("/", getAllTable);
router.get("/:id", getOneTable);
router.post("/", addOneTable);
router.post("/Many", addManyTable);
router.put("/Many", updateManyTable);
router.put("/:id", updateOneTable);
router.delete("/Many", deleteManyTable);
router.delete("/:id", deleteOneTable);

module.exports = router;
