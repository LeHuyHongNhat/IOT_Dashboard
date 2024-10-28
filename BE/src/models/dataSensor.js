const prisma = require("./db-client");

// Tìm kiếm dữ liệu cảm biến theo điều kiện
const findDataSensorByContidion = async (condition, pagination, order) => {
  try {
    const result = await prisma.sensorData.findMany({
      where: condition,
      ...pagination,
      orderBy: order,
      include: {
        // Thêm các trường cần thiết
      },
    });
    return result;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    throw error;
  }
};

// Tạo dữ liệu cảm biến mới
const createDataSensor = async (data) => {
  try {
    const sensorData = await prisma.sensorData.create({
      data: {
        temperature: data.temperature,
        humidity: data.humidity,
        light: data.light,
        gas: data.gas || 0,
      },
    });

    if (data.gas > 70) {
      await prisma.actionHistory.create({
        data: {
          device: "GAS_WARNING",
          action: "ON",
          createdAt: new Date(),
        },
      });
    }

    return sensorData;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
};

// Hàm xóa các bản ghi cũ, chỉ giữ lại 100 bản ghi mới nhất
const deleteOldRecords = async () => {
  await prisma.$executeRaw`
    DELETE FROM \`sensor_data\`
    WHERE \`id\` NOT IN (
      SELECT \`id\` FROM (
        SELECT \`id\` FROM \`sensor_data\`
        ORDER BY \`createdAt\` DESC
        LIMIT 100
      ) AS subquery
    );
  `;
};

// Hàm đếm số lượng bản ghi dữ liệu cảm biến theo điều kiện
const countNumberDataSensorByCondition = async (condition) => {
  if (condition.createdAt instanceof Date) {
    condition.createdAt = {
      gte: condition.createdAt,
      lt: new Date(condition.createdAt.getTime() + 1000),
    };
  }

  return await prisma.sensorData.count({
    where: condition,
  });
};

// Thêm hàm để lấy lịch sử cảnh báo gas
const getGasWarningHistory = async (startDate, endDate) => {
  return await prisma.actionHistory.findMany({
    where: {
      device: "GAS_WARNING",
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Thêm hàm để lấy số lần cảnh báo gas trong ngày
const getGasWarningCount = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.actionHistory.count({
    where: {
      device: "GAS_WARNING",
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
};

// Thêm hàm getLatestGasData
const getLatestGasData = async () => {
  try {
    const latestData = await prisma.sensorData.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    return latestData;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu gas mới nhất:", error);
    throw error;
  }
};

// Xuất các hàm để sử dụng ở nơi khác
module.exports = {
  findDataSensorByContidion,
  createDataSensor,
  deleteOldRecords,
  countNumberDataSensorByCondition,
  getGasWarningHistory,
  getGasWarningCount,
  getLatestGasData,
};
