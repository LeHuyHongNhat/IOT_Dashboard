const express = require('express');
const { postDataSensor } = require('../controllers/dataSensor');

const route = express.Router(); // Tạo một instance của Router từ Express

// Định nghĩa route cho yêu cầu POST đến endpoint gốc ('/')
route.post('/', postDataSensor);

// Xuất module route để sử dụng ở nơi khác
module.exports = route;
