const express = require("express");
const router = express.Router();
const dataSensorController = require("../controllers/dataSensor");
const { getActionHistory } = require("../controllers/actionHistory");

// Sửa lại các routes
router.get("/data", dataSensorController.getDataSensors);
router.get("/action", getActionHistory);

module.exports = router;
