const express = require('express');
const { postDataSensor } = require('../controllers/dataSensor');

const route = express.Router();

route.post('/', postDataSensor);

module.exports = route;