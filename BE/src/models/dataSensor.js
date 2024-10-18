const prisma = require('./db-client');
const createDataSensor = async (data) => {
  return await prisma.sensorData.create({
    data: data
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
  return await prisma.sensorData.findMany({
    where: condition,
    ...pagination,
    orderBy: order
  });
};

const countNumberDataSensorByCondition = async (condition) => {
  return await prisma.sensorData.count({
    where: condition
  });
};

const countDataGreater = async (x) => {
  return await prisma.sensorData.count({
    where: {
      gas: {
        gt: Number(x)
      }
    }
  });
};

const countHighLightOccurrencesAbove800 = async () => {
  const today = new Date();

  // Bắt đầu và kết thúc của ngày
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const result = await prisma.sensorData.aggregate({
    _max: {
      light: true // Lấy giá trị lớn nhất của trường light
    },
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });

  return result._max.light;
};

const get10datalast = async () => {
  return await prisma.sensorData.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })
}

module.exports = {
  createDataSensor,
  deleteOldRecords,
  findDataSensorByContidion,
  countNumberDataSensorByCondition,
  countHighLightOccurrencesAbove800,
  get10datalast,
  countDataGreater
};
