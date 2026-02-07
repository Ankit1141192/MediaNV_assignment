const express = require("express");
const { checkDB } = require("../controllers/db.controller");

const router = express.Router();

router.get("/check-db", checkDB);

module.exports = router;
