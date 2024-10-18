const express = require('express');
const { getDataSensors } = require('../controllers/dataSensor');
const { getActionHistory, getOnLed, getOffFan } = require('../controllers/actionHistory');

const route = express.Router();

route.get('/data', getDataSensors);
route.get('/action', getActionHistory);
route.get('/onLed', getOnLed);
route.get('/offFan', getOffFan);


module.exports = route;
