const dataSensorModel = require('../models/dataSensor');
const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, TIME_ZONE } = require('../constant');
const { fromZonedTime } = require('date-fns-tz');
const { convertUtcToVnTime } = require('../util');

async function postDataSensor(req, res) {
  try {
    const newDataSensor = await dataSensorModel.createDataSensor();
    res.status(200).json({
      message: 'Data successfully!',
      data: newDataSensor
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error !',
      error
    });
  }
}

async function getDataLight(req, res) {
  try {
    const xxxx = await dataSensorModel.countHighLightOccurrencesAbove800();
    res.status(200).json({
      message: 'Data successfully!',
      totalCount: xxxx
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error !',
      error
    });
  }
}

async function get10DataLast(req, res) {
  try {
    const data = await dataSensorModel.get10datalast();
    res.status(200).json({
      data: data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error !',
      error
    });
  }
}

async function countData(req, res) {
  try {
    const conSoGiDo = 50;
    const count = await dataSensorModel.countDataGreater(conSoGiDo);
    res.status(200).json(count)
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error !',
      error
    });
  }
}


async function getDataSensors(req, res) {
  try {
    let { content, searchBy, startTime, endTime, page, pageSize, sortBy, orderBy } = req.query;
    let condition = {};
    let order = {};

    page = Math.max(Number(page) || PAGE_DEFAULT, 1);
    pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

    const pagination = {
      skip: (page - 1) * pageSize,
      take: pageSize
    };

    if (content && searchBy) {

      switch (searchBy) {
        case 'ID':
          condition.id = Number(content);
          break;
        case 'TEMPERATURE':
          condition.temperature = Number(content);
          break;
        case 'HUMIDITY':
          condition.humidity = Number(content);
          break;
        case 'LIGHT':
          condition.light = Number(content);
          break;
        case 'GAS':
          condition.gas = Number(content);
          break;
        case 'ALL':
          condition.OR = [
            {
              id: Number(content)
            },
            {
              temperature: Number(content)
            },
            {
              humidity: Number(content)
            },
            {
              light: Number(content)
            },
            {
              gas: Number(content)
            }
          ];
          break;
        case 'TIME':
          break;
        default:
          res.status(400).json({
            message: 'searchBy must be one of the following parameters [ALL,TEMPERATURE,HUMIDITY,LIGHT,ID]'
          });
          return;
      }
    }

    if (startTime && endTime) {
      condition.createdAt = {
        gte: fromZonedTime(startTime, TIME_ZONE),
        lte: fromZonedTime(endTime, TIME_ZONE)
      };
    }

    if (orderBy && orderBy !== 'ASC' && orderBy !== 'DESC') {
      res.status(400).json({
        message: 'orderBy must be one of the following parameters [ASC, DESC]'
      });
      return;
    }

    orderBy = orderBy?.toLowerCase() || 'asc';

    if (sortBy) {
      switch (sortBy) {
        case 'ID':
          order.id = orderBy;
          break;
        case 'TEMPERATURE':
          order.temperature = orderBy;
          break;
        case 'HUMIDITY':
          order.humidity = orderBy;
          break;
        case 'LIGHT':
          order.light = orderBy;
          break;
        case 'GAS':
          order.gas = orderBy;
          break;
        case 'TIME':
          order.createdAt = orderBy;
          break;
        default:
          res.status(400).json({
            message: 'sortBy must be one of the following parameters [TIME,TEMPERATURE,HUMIDITY,LIGHT,ID]'
          });
          break;
      }
    } else order.id = orderBy;

    let [data, totalCount] = await Promise.all([
      await dataSensorModel.findDataSensorByContidion(condition, pagination, order),
      await dataSensorModel.countNumberDataSensorByCondition(condition)
    ]);

    if (searchBy == 'TIME' && content.length > 0) {
      data = data.filter(d => {
        const time = convertUtcToVnTime(d.createdAt)
        return time.includes(content.trim())
      })
    }

    res.status(200).json({
      data,
      meta: {
        page,
        pageSize,
        totalCount
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error !',
      error: error.message
    });
  }
}

module.exports = {
  postDataSensor,
  getDataSensors,
  getDataLight,
  get10DataLast,
  countData
};
