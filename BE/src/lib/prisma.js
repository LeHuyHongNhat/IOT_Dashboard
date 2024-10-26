const { PrismaClient } = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["error"] // Chỉ log các lỗi
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;
