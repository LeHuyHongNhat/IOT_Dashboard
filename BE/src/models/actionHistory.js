const prisma = require("./db-client");

// Hàm xóa các bản ghi cũ, chỉ giữ lại 100 bản ghi mới nhất
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

// Hàm tạo một bản ghi lịch sử hành động mới
const createActionHistory = async (data) => {
  return await prisma.actionHistory.create({
    data: data,
  });
};

// Hàm tìm kiếm lịch sử hành động theo điều kiện và phân trang
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
      createdAt: "desc", // Sắp xếp theo thời gian tạo giảm dần
    },
  });
};

// Hàm đếm số lượng bản ghi lịch sử hành động theo điều kiện
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

// Xuất các hàm để sử dụng ở nơi khác
module.exports = {
  deleteOldRecords,
  findActionHistoryByContidion,
  countNumberActionHistoryByCondition,
  createActionHistory,
};
