const express = require("express");
const router = express.Router();
const loginapp = require("../../controllers/login&auth/login");

router.post("/", loginapp);

module.exports = router;
