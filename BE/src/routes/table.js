const express = require('express');
const { getDataSensors } = require('../controllers/dataSensor');
const { getActionHistory, getOnLed, getOffFan } = require('../controllers/actionHistory');

const route = express.Router();

/**
 * @swagger
 * /table/data:
 *   get:
 *     summary: Get sensor data with optional filtering, sorting, and pagination
 *     description: Retrieve sensor data with various filters, including searching by ID, temperature, humidity, light, and gas. Sorting and pagination are supported.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         required: false
 *         description: |
 *           The content value to search by. Can be one of the following fields:
 *           ID, TEMPERATURE, HUMIDITY, LIGHT, GAS, or ALL.
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [ID, TEMPERATURE, HUMIDITY, LIGHT, GAS, ALL, TIME]
 *         required: false
 *         description: |
 *           The field to search by. Available options:
 *           ID, TEMPERATURE, HUMIDITY, LIGHT, GAS, ALL, TIME.
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: The start time for filtering data based on creation time.
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: The end time for filtering data based on creation time.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: The number of records per page for pagination.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [ID, TEMPERATURE, HUMIDITY, LIGHT, GAS, TIME]
 *         required: false
 *         description: |
 *           The field to sort the results by. Available options:
 *           ID, TEMPERATURE, HUMIDITY, LIGHT, GAS, TIME.
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         required: false
 *         description: |
 *           The order in which to sort the results. Available options:
 *           ASC, DESC.
 *     responses:
 *       200:
 *         description: Successful response with sensor data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Sensor ID
 *                       temperature:
 *                         type: number
 *                         description: Temperature value
 *                       humidity:
 *                         type: number
 *                         description: Humidity value
 *                       light:
 *                         type: number
 *                         description: Light value
 *                       gas:
 *                         type: number
 *                         description: Gas value
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation time of the sensor record
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                     pageSize:
 *                       type: integer
 *                       description: Number of records per page
 *                     totalCount:
 *                       type: integer
 *                       description: Total number of records
 *       400:
 *         description: Bad request (invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
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
 *                   type: string
 *                   description: Details about the error
 */

route.get('/data', getDataSensors);

/**
 * @swagger
 * /table/action:
 *   get:
 *     summary: Get action history with optional filtering and pagination
 *     description: Retrieve a list of action history records filtered by device type and time range. Supports pagination.
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         required: false
 *         description: A keyword to filter the action history by matching time values.
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [ALL, FAN, LED, AIR_CONDITIONER]
 *         required: false
 *         description: |
 *           The type of device to filter the action history by. Available options:
 *           - ALL: Show all device actions
 *           - FAN: Show actions related to the fan
 *           - LED: Show actions related to the LED
 *           - AIR_CONDITIONER: Show actions related to the air conditioner
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: The start time for filtering action history records based on creation time.
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: The end time for filtering action history records based on creation time.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: The number of records per page for pagination.
 *     responses:
 *       200:
 *         description: Successfully retrieved action history data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Action ID
 *                       device:
 *                         type: string
 *                         description: Type of device (e.g., FAN, LED, AIR_CONDITIONER)
 *                       status:
 *                         type: string
 *                         description: Status of the action performed
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Time when the action was created
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                     pageSize:
 *                       type: integer
 *                       description: Number of records per page
 *                     totalCount:
 *                       type: integer
 *                       description: Total number of records
 *       400:
 *         description: Bad request due to invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
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
 *                   type: string
 *                   description: Error details
 */

route.get('/action', getActionHistory);

/**
 * @swagger
 * /table/onLed:
 *   get:
 *     summary: Get the count of LED on actions
 *     description: Retrieve the total number of times the LED has been turned on.
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of LED on actions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data successfully!
 *                 totalCount:
 *                   type: integer
 *                   description: The total number of times the LED has been turned on.
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

route.get('/onLed', getOnLed);

/**
 * @swagger
 * /table/offFan:
 *   get:
 *     summary: Get the count of fan off actions
 *     description: Retrieve the total number of times the fan has been turned off.
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of fan off actions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data successfully!
 *                 totalCount:
 *                   type: integer
 *                   description: The total number of times the fan has been turned off.
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

route.get('/offFan', getOffFan);


module.exports = route;
