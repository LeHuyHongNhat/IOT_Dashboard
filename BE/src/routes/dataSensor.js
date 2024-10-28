const express = require("express");
const router = express.Router();
const dataSensorController = require("../controllers/dataSensor");

// Sửa lại routes để khớp với các hàm đã định nghĩa trong controller
router.get("/", dataSensorController.getDataSensors); // Thay getAllDataSensor bằng getDataSensors
router.get("/gas/warnings/count", dataSensorController.getGasWarningCount);

module.exports = router;
