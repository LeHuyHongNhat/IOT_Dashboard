const express = require('express');
const { postDataSensor ,getDataSensors} = require('../controllers/dataSensor');
const { getActionHistory } = require('../controllers/actionHistory');

const route = express.Router();

route.get('/data', getDataSensors);
route.get('/action', getActionHistory);

module.exports = route;