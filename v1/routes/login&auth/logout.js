const express = require("express");
const router = express.Router();
const { logout } = require("../../controllers/login&auth/logout");

router.get("/", logout);

module.exports = router;
