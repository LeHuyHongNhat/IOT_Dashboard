const dataSensorModel = require("../models/dataSensor");
const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, TIME_ZONE } = require("../constant");
const { fromZonedTime } = require("date-fns-tz");

// Hàm xử lý yêu cầu POST để tạo dữ liệu cảm biến mới
async function postDataSensor(req, res) {
  try {
    // Tạo dữ liệu cảm biến mới
    const newDataSensor = await dataSensorModel.createDataSensor();
    // Trả về phản hồi thành công
    res.status(200).json({
      message: "Data successfully!",
      data: newDataSensor,
    });
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi
    res.status(500).json({
      message: "Internal Server Error !",
      error,
    });
  }
}

// Hàm xử lý yêu cầu GET để lấy dữ liệu cảm biến
async function getDataSensors(req, res) {
  try {
    // Lấy các tham số từ query của request
    let { content, searchBy, page, pageSize, sortBy, orderBy } = req.query;
    let condition = {};
    let order = {};

    // Thiết lập giá trị mặc định cho page và pageSize nếu không có
    page = Math.max(Number(page) || PAGE_DEFAULT, 1);
    pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

    // Tạo đối tượng phân trang
    const pagination = {
      skip: (page - 1) * pageSize,
      take: pageSize,
    };

    // Xử lý điều kiện tìm kiếm nếu có
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
          // Tìm kiếm theo tất cả các trường
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
          // Trả về lỗi nếu searchBy không hợp lệ
          res.status(400).json({
            message:
              "searchBy phải là một trong các tham số sau [ALL,TEMPERATURE,HUMIDITY,LIGHT,ID,TIME]",
          });
          return;
      }
    }

    // Kiểm tra giá trị orderBy
    if (orderBy && orderBy !== "ASC" && orderBy !== "DESC") {
      res.status(400).json({
        message: "orderBy must be one of the following parameters [ASC, DESC]",
      });
      return;
    }

    orderBy = orderBy?.toLowerCase() || "asc";

    // Xử lý điều kiện sắp xếp nếu có
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
          // Trả về lỗi nếu sortBy không hợp lệ
          res.status(400).json({
            message:
              "sortBy must be one of the following parameters [TIME,TEMPERATURE,HUMIDITY,LIGHT,ID]",
          });
          break;
      }
    } else order.id = orderBy;

    // Thực hiện truy vấn dữ liệu và đếm tổng số bản ghi
    const [data, totalCount] = await Promise.all([
      await dataSensorModel.findDataSensorByContidion(
        condition,
        pagination,
        order
      ),
      await dataSensorModel.countNumberDataSensorByCondition(condition),
    ]);

    // Trả về kết quả dưới dạng JSON
    res.status(200).json({
      data,
      meta: {
        page,
        pageSize,
        totalCount,
      },
    });
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi
    res.status(500).json({
      message: "Internal Server Error !",
      error: error.message,
    });
  }
}

// Xuất các hàm để sử dụng ở nơi khác
module.exports = {
  postDataSensor,
  getDataSensors,
};
