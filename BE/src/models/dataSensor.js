const prisma = require("./db-client");
const createDataSensor = async (data) => {
  return await prisma.sensorData.create({
    data: data,
  });
};

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

const findDataSensorByContidion = async (condition, pagination, order) => {
  // Thêm xử lý cho trường hợp tìm kiếm theo thời gian chính xác
  if (condition.createdAt instanceof Date) {
    condition.createdAt = {
      gte: condition.createdAt,
      lt: new Date(condition.createdAt.getTime() + 1000), // Thêm 1 giây
    };
  }

  return await prisma.sensorData.findMany({
    where: condition,
    ...pagination,
    orderBy: order,
  });
};

const countNumberDataSensorByCondition = async (condition) => {
  // Thêm xử lý cho trường hợp đếm theo thời gian chính xác
  if (condition.createdAt instanceof Date) {
    condition.createdAt = {
      gte: condition.createdAt,
      lt: new Date(condition.createdAt.getTime() + 1000), // Thêm 1 giây
    };
  }

  return await prisma.sensorData.count({
    where: condition,
  });
};

module.exports = {
  createDataSensor,
  deleteOldRecords,
  findDataSensorByContidion,
  countNumberDataSensorByCondition,
};
