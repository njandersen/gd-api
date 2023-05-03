const express = require("express");
const router = express.Router();

const tagController = require("../controllers/Tags");

router.get("/tags", tagController.getAllTags);

module.exports = router;
