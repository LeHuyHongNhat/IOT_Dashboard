const prisma = require("./db-client");

const deleteOldRecords = async () => {
  await prisma.$executeRaw`
                                DELETE FROM \`action_history\`
                                WHERE \`id\` NOT IN (
                                    SELECT \`id\` FROM (
                                        SELECT \`id\` FROM \`action_history\`
                                        ORDER BY \`createdAt\` DESC
                                        LIMIT 100
                                    ) AS subquery
                                );
                            `;
};

const createActionHistory = async (data) => {
  return await prisma.actionHistory.create({
    data: data,
  });
};

const findActionHistoryByContidion = async (condition, pagination) => {
  // Xử lý điều kiện thời gian nếu có
  if (
    condition.createdAt &&
    condition.createdAt.gte &&
    condition.createdAt.lt
  ) {
    condition.createdAt = {
      gte: new Date(condition.createdAt.gte),
      lt: new Date(condition.createdAt.lt),
    };
  }

  return await prisma.actionHistory.findMany({
    where: condition,
    ...pagination,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const countNumberActionHistoryByCondition = async (condition) => {
  // Xử lý điều kiện thời gian nếu có
  if (
    condition.createdAt &&
    condition.createdAt.gte &&
    condition.createdAt.lt
  ) {
    condition.createdAt = {
      gte: new Date(condition.createdAt.gte),
      lt: new Date(condition.createdAt.lt),
    };
  }

  return await prisma.actionHistory.count({
    where: condition,
  });
};

module.exports = {
  deleteOldRecords,
  findActionHistoryByContidion,
  countNumberActionHistoryByCondition,
  createActionHistory,
};
