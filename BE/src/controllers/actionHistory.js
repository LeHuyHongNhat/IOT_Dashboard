const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, TIME_ZONE } = require("../constant");
const { fromZonedTime } = require("date-fns-tz");
const actionHistoryModel = require("../models/actionHistory");
const { convertUtcToVnTime } = require("../util");

// Hàm lấy lịch sử hoạt động với các tuỳ chọn tìm kiếm nâng cao
async function getActionHistory(req, res) {
  try {
    let { content, searchBy, startTime, endTime, page, pageSize } = req.query;
    let condition = {};
    page = Math.max(Number(page) || PAGE_DEFAULT, 1);
    pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);
    const pagination = {
      skip: (page - 1) * pageSize,
      take: pageSize,
    };
    searchBy ||= "ALL";
    if (
      ["ALL", "FAN", "LED", "AIR_CONDITIONER", "GAS_WARNING"].includes(searchBy)
    ) {
      if (searchBy !== "ALL") condition.device = searchBy;
    } else {
      res.status(400).json({
        message:
          "searchBy phải là một trong các giá trị [ALL, AIR_CONDITIONER, FAN, LED, GAS_WARNING]",
      });
      return;
    }
    if (startTime && endTime) {
      condition.createdAt = {
        gte: fromZonedTime(startTime, TIME_ZONE),
        lte: fromZonedTime(endTime, TIME_ZONE),
      };
    }
    let [data, totalCount] = await Promise.all([
      await actionHistoryModel.findActionHistoryByContidion(
        condition,
        pagination
      ),
      await actionHistoryModel.countNumberActionHistoryByCondition(condition),
    ]);
    if (content) {
      data = data.filter((d) => {
        const time = convertUtcToVnTime(d.createdAt);
        return time.includes(content.trim());
      });
    }
    res.status(200).json({
      data,
      meta: {
        page,
        pageSize,
        totalCount,
      },
    });
  } catch (error) {
    console.log("🚀 ~ getActionHistory ~ lỗi:", error);
    res.status(500).json({
      message: "Lỗi máy chủ nội bộ!",
      error: error.message,
    });
  }
}

// Hàm đếm số lần đèn LED bật
async function getOnLed(req, res) {
  try {
    const count = await actionHistoryModel.countLedOnByCondition();
    res.status(200).json({
      message: "Dữ liệu được lấy thành công!",
      totalCount: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ nội bộ!",
      error,
    });
  }
}

// Hàm đếm số lần quạt tắt
async function getOffFan(req, res) {
  try {
    const count = await actionHistoryModel.countFanOffByCondition();
    res.status(200).json({
      message: "Dữ liệu được lấy thành công!",
      totalCount: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ nội bộ!",
      error,
    });
  }
}

// Hàm bật/tắt đèn LED
async function toggleLed(req, res) {
  try {
    const { state } = req.query; // state có thể là "on" hoặc "off"
    const result = await actionHistoryModel.toggleLedState(state);
    res.status(200).json({
      message: `Đèn LED đã được chuyển sang trạng thái ${state}`,
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ nội bộ!",
      error,
    });
  }
}

// Hàm bật/tắt quạt
async function toggleFan(req, res) {
  try {
    const { state } = req.query; // state có thể là "on" hoặc "off"
    const result = await actionHistoryModel.toggleFanState(state);
    res.status(200).json({
      message: `Quạt đã được chuyển sang trạng thái ${state}`,
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ nội bộ!",
      error,
    });
  }
}

module.exports = {
  getActionHistory,
  getOnLed,
  getOffFan,
  toggleLed,
  toggleFan,
};
