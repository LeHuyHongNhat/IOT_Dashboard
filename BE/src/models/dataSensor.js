const prisma = require("./db-client");

// Hàm tạo một bản ghi dữ liệu cảm biến mới
const createDataSensor = async (data) => {
  return await prisma.sensorData.create({
    data: data,
  });
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

// Hàm tìm kiếm dữ liệu cảm biến theo điều kiện, phân trang và sắp xếp
const findDataSensorByContidion = async (condition, pagination, order) => {
  // Thêm xử lý cho trường hợp tìm kiếm theo thời gian chính xác
  if (condition.createdAt instanceof Date) {
    condition.createdAt = {
      gte: condition.createdAt,
      lt: new Date(condition.createdAt.getTime() + 1000), // Thêm 1 giây để bao gồm cả thời điểm tìm kiếm
    };
  }

  return await prisma.sensorData.findMany({
    where: condition,
    ...pagination,
    orderBy: order,
  });
};

// Hàm đếm số lượng bản ghi dữ liệu cảm biến theo điều kiện
const countNumberDataSensorByCondition = async (condition) => {
  // Thêm xử lý cho trường hợp đếm theo thời gian chính xác
  if (condition.createdAt instanceof Date) {
    condition.createdAt = {
      gte: condition.createdAt,
      lt: new Date(condition.createdAt.getTime() + 1000), // Thêm 1 giây để bao gồm cả thời điểm tìm kiếm
    };
  }

  return await prisma.sensorData.count({
    where: condition,
  });
};

// Xuất các hàm để sử dụng ở nơi khác
module.exports = {
  createDataSensor,
  deleteOldRecords,
  findDataSensorByContidion,
  countNumberDataSensorByCondition,
};
