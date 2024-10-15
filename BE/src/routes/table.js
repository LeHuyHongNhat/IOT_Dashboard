const express = require("express");
const { postDataSensor, getDataSensors } = require("../controllers/dataSensor"); // Import các hàm điều khiển cho dữ liệu cảm biến
const { getActionHistory } = require("../controllers/actionHistory"); // Import hàm điều khiển cho lịch sử hành động

const route = express.Router(); // Tạo một instance của Router từ Express

// Định nghĩa route cho yêu cầu GET để lấy dữ liệu cảm biến tại endpoint '/data'
route.get("/data", getDataSensors);

// Định nghĩa route cho yêu cầu GET để lấy lịch sử hành động tại endpoint '/action'
route.get("/action", getActionHistory);

// Xuất module route để sử dụng ở nơi khác
module.exports = route;
