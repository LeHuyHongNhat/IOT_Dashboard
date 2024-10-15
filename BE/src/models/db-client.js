const { PrismaClient } = require("@prisma/client"); // Import PrismaClient từ thư viện @prisma/client
const prisma = new PrismaClient(); // Tạo một instance của PrismaClient để kết nối với cơ sở dữ liệu
module.exports = prisma; // Xuất instance này để sử dụng ở các phần khác của ứng dụng
