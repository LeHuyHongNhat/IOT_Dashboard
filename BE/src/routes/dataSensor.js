const express = require('express');
const { postDataSensor, getDataLight, get10DataLast, countData } = require('../controllers/dataSensor');
const { Device } = require('@prisma/client');
const prisma = require('../models/db-client');

const route = express.Router();

route.post('/', postDataSensor);
route.get('/light-gas', getDataLight);
route.get('/10-data-last', get10DataLast);
route.get('/count-data', countData);
route.get('/action/last', async (req, res) => {
    const lastLedAction = await prisma.actionHistory.findFirst({
        orderBy: {
            createdAt: 'desc'
        },
        where: {
            device: Device.LED
        }
    });
    const lastFanAction = await prisma.actionHistory.findFirst({
        orderBy: {
            createdAt: 'desc'
        },
        where: {
            device: Device.FAN
        }
    });
    const lastAirCAction = await prisma.actionHistory.findFirst({
        orderBy: {
            createdAt: 'desc'
        },
        where: {
            device: Device.AIR_CONDITIONER
        }
    });
    const lastLampAction = await prisma.actionHistory.findFirst({
        orderBy: {
            createdAt: 'desc'
        },
        where: {
            device: Device.LAMP
        }
    });

    res.json({
        led: lastLedAction?.action || 'OFF',
        fan: lastFanAction?.action || 'OFF',
        airConditioner: lastAirCAction?.action || 'OFF',
        lamp: lastLampAction?.action || 'OFF'
    });
});

module.exports = route;
