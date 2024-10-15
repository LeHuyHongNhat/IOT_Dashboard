const cron = require("node-cron");
const dataSensorModel = require("../models/dataSensor");

// Hàm để lên lịch các công việc cron
const scheduleCronJobs = async () => {
  // Lên lịch một cron job chạy mỗi 3 phút
  cron.schedule("*/3 * * * *", async () => {
    try {
      // Gọi hàm xóa các bản ghi cũ từ mô hình dữ liệu cảm biến
      await dataSensorModel.deleteOldRecords();
      console.log("Đã xoá dữ liệu cũ");
    } catch (error) {
      // Xử lý lỗi nếu có trong quá trình chạy cron job
      console.error("Lỗi khi chạy cron job:", error);
    }
  });
};

// Xuất hàm để sử dụng ở nơi khác
module.exports = scheduleCronJobs;
