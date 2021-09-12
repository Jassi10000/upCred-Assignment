const express = require("express");
const router = express.Router();
const fetchController = require("../controllers/fetchControllers");

router.get("/update" , fetchController.fetchData);

module.exports = router;