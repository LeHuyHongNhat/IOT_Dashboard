const dataSensorModel = require("../models/dataSensor");
const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, TIME_ZONE } = require("../constant");
const { fromZonedTime } = require("date-fns-tz");

async function postDataSensor(req, res) {
  try {
    const newDataSensor = await dataSensorModel.createDataSensor();
    res.status(200).json({
      message: "Data successfully!",
      data: newDataSensor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error !",
      error,
    });
  }
}

async function getDataSensors(req, res) {
  try {
    let { content, searchBy, page, pageSize, sortBy, orderBy } = req.query;
    let condition = {};
    let order = {};

    page = Math.max(Number(page) || PAGE_DEFAULT, 1);
    pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

    const pagination = {
      skip: (page - 1) * pageSize,
      take: pageSize,
    };

    content = content?.trim();
    if (content && searchBy) {
      switch (searchBy) {
        case "ID":
          condition.id = Number(content);
          break;
        case "TEMPERATURE":
          condition.temperature = Number(content);
          break;
        case "HUMIDITY":
          condition.humidity = Number(content);
          break;
        case "LIGHT":
          condition.light = Number(content);
          break;
        case "TIME":
          // Chuyển đổi định dạng thời gian từ "hh:mm:ss dd/mm/yyyy" sang Date object
          const [time, date] = content.split(" ");
          const [hours, minutes, seconds] = time.split(":");
          const [day, month, year] = date.split("/");
          const searchDate = new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            seconds
          );
          condition.createdAt = searchDate;
          break;
        case "ALL":
          condition.OR = [
            { id: isNaN(Number(content)) ? undefined : Number(content) },
            {
              temperature: isNaN(Number(content)) ? undefined : Number(content),
            },
            { humidity: isNaN(Number(content)) ? undefined : Number(content) },
            { light: isNaN(Number(content)) ? undefined : Number(content) },
            {
              createdAt: {
                equals: new Date(content),
              },
            },
          ].filter((c) => Object.values(c)[0] !== undefined);
          break;
        default:
          res.status(400).json({
            message:
              "searchBy phải là một trong các tham số sau [ALL,TEMPERATURE,HUMIDITY,LIGHT,ID,TIME]",
          });
          return;
      }
    }

    if (orderBy && orderBy !== "ASC" && orderBy !== "DESC") {
      res.status(400).json({
        message: "orderBy must be one of the following parameters [ASC, DESC]",
      });
      return;
    }

    orderBy = orderBy?.toLowerCase() || "asc";

    if (sortBy) {
      switch (sortBy) {
        case "ID":
          order.id = orderBy;
          break;
        case "TEMPERATURE":
          order.temperature = orderBy;
          break;
        case "HUMIDITY":
          order.humidity = orderBy;
          break;
        case "LIGHT":
          order.light = orderBy;
          break;
        case "TIME":
          order.createdAt = orderBy;
          break;
        default:
          res.status(400).json({
            message:
              "sortBy must be one of the following parameters [TIME,TEMPERATURE,HUMIDITY,LIGHT,ID]",
          });
          break;
      }
    } else order.id = orderBy;

    const [data, totalCount] = await Promise.all([
      await dataSensorModel.findDataSensorByContidion(
        condition,
        pagination,
        order
      ),
      await dataSensorModel.countNumberDataSensorByCondition(condition),
    ]);

    res.status(200).json({
      data,
      meta: {
        page,
        pageSize,
        totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error !",
      error: error.message,
    });
  }
}

module.exports = {
  postDataSensor,
  getDataSensors,
};
