const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } = require("../constant");
const actionHistoryModel = require("../models/actionHistory");

// Hàm bất đồng bộ để lấy lịch sử hành động
async function getActionHistory(req, res) {
  try {
    // Lấy các tham số từ query của request
    let { searchBy, time, page, pageSize } = req.query;
    let condition = {};

    // Thiết lập giá trị mặc định cho page và pageSize nếu không có
    page = Math.max(Number(page) || PAGE_DEFAULT, 1);
    pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

    // Tạo đối tượng phân trang
    const pagination = {
      skip: (page - 1) * pageSize,
      take: pageSize,
    };

    // Thiết lập giá trị mặc định cho searchBy
    searchBy ||= "ALL";
    if (["ALL", "FAN", "LED", "AIR_CONDITIONER"].includes(searchBy)) {
      if (searchBy !== "ALL") condition.device = searchBy;
    } else {
      // Trả về lỗi nếu searchBy không hợp lệ
      res.status(400).json({
        message:
          "searchBy phải là một trong các tham số sau [ALL, AIR_CONDITIONER, FAN, LED]",
      });
      return;
    }

    if (time) {
      // Chuyển đổi định dạng thời gian từ "hh:mm:ss dd/mm/yyyy" sang Date object
      const [timePart, datePart] = time.split(" ");
      const [hours, minutes, seconds] = timePart.split(":");
      const [day, month, year] = datePart.split("/");
      const searchDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds
      );

      // Thiết lập điều kiện tìm kiếm theo thời gian
      condition.createdAt = {
        gte: searchDate,
        lt: new Date(searchDate.getTime() + 1000), // Thêm 1 giây để bao gồm cả thời điểm tìm kiếm
      };
    }

    // Thực hiện truy vấn dữ liệu và đếm tổng số bản ghi
    const [data, totalCount] = await Promise.all([
      await actionHistoryModel.findActionHistoryByContidion(
        condition,
        pagination
      ),
      await actionHistoryModel.countNumberActionHistoryByCondition(condition),
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
      message: "Lỗi máy chủ nội bộ!",
      error: error.message,
    });
  }
}

module.exports = {
  getActionHistory,
};
