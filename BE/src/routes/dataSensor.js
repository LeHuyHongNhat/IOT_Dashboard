const express = require('express');
const { postDataSensor, getDataLight, get10DataLast, countData } = require('../controllers/dataSensor');
const { Device } = require('@prisma/client');
const prisma = require('../models/db-client');

const route = express.Router();

route.post('/', postDataSensor);
route.get('/light-gas', getDataLight);

/**
 * @swagger
 * /data/10-data-last:
 *   get:
 *     summary: Get the last 10 sensor data entries
 *     description: Retrieve the latest 10 data entries from the sensor records.
 *     responses:
 *       200:
 *         description: Successfully retrieved the last 10 sensor data entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: An array containing the last 10 sensor data entries.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the sensor data.
 *                       temperature:
 *                         type: number
 *                         description: The recorded temperature value.
 *                       humidity:
 *                         type: number
 *                         description: The recorded humidity value.
 *                       light:
 *                         type: number
 *                         description: The recorded light value.
 *                       gas:
 *                         type: number
 *                         description: The recorded gas value.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp of when the data was recorded.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */

route.get('/10-data-last', get10DataLast);

/**
 * @swagger
 * /data/count-data:
 *   get:
 *     summary: Count sensor data entries greater than a specific value
 *     description: Retrieve the count of sensor data entries where a specific parameter (e.g., temperature, humidity, etc.) is greater than 50.
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of sensor data entries greater than 50.
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               description: The count of sensor data entries with values greater than 50.
 *               example: 120
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */

route.get('/count-data', countData);

/**
 * @swagger
 * /data/action/last:
 *   get:
 *     summary: Get the last action for each device
 *     description: Retrieve the most recent action for LED, Fan, Air Conditioner, and Lamp devices from the action history.
 *     responses:
 *       200:
 *         description: Successfully retrieved the last action for each device.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 led:
 *                   type: string
 *                   description: The last action for the LED device.
 *                   example: "ON"
 *                 fan:
 *                   type: string
 *                   description: The last action for the Fan device.
 *                   example: "OFF"
 *                 airConditioner:
 *                   type: string
 *                   description: The last action for the Air Conditioner device.
 *                   example: "ON"
 *                 lamp:
 *                   type: string
 *                   description: The last action for the Lamp device.
 *                   example: "OFF"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */

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
