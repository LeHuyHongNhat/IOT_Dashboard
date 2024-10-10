const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } = require("../constant");
const actionHistoryModel = require("../models/actionHistory");

async function getActionHistory(req, res) {
  try {
    let { searchBy, time, page, pageSize } = req.query;
    let condition = {};

    page = Math.max(Number(page) || PAGE_DEFAULT, 1);
    pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

    const pagination = {
      skip: (page - 1) * pageSize,
      take: pageSize,
    };

    searchBy ||= "ALL";
    if (["ALL", "FAN", "LED", "AIR_CONDITIONER"].includes(searchBy)) {
      if (searchBy !== "ALL") condition.device = searchBy;
    } else {
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

      condition.createdAt = {
        gte: searchDate,
        lt: new Date(searchDate.getTime() + 1000), // Thêm 1 giây để bao gồm cả thời điểm tìm kiếm
      };
    }

    const [data, totalCount] = await Promise.all([
      await actionHistoryModel.findActionHistoryByContidion(
        condition,
        pagination
      ),
      await actionHistoryModel.countNumberActionHistoryByCondition(condition),
    ]);

    res.status(200).json({
      data,
      meta: {
        page,
        pageSize,
        totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ nội bộ!",
      error: error.message,
    });
  }
}

module.exports = {
  getActionHistory,
};
