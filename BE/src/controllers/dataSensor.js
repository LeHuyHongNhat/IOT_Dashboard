const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Lấy tất cả dữ liệu cảm biến
const getDataSensors = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "id",
      orderBy = "desc",
      searchBy = "ALL",
      content = "",
    } = req.query;

    const skip = (page - 1) * pageSize;

    // Build the where clause based on search parameters
    let where = {};
    if (content && searchBy !== "ALL") {
      if (searchBy === "TIME") {
        where.createdAt = {
          contains: content,
        };
      } else {
        const field = searchBy.toLowerCase();
        where[field] = {
          equals: isNaN(content) ? content : Number(content),
        };
      }
    }

    const [data, totalCount] = await Promise.all([
      prisma.sensorData.findMany({
        where,
        take: parseInt(pageSize),
        skip: parseInt(skip),
        orderBy: sortBy ? { [sortBy]: orderBy.toLowerCase() } : { id: "desc" },
      }),
      prisma.sensorData.count({ where }),
    ]);

    res.json({
      success: true,
      data: data,
      meta: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalCount,
      },
    });
  } catch (error) {
    console.error("Error in getDataSensors:", error);
    res.status(500).json({
      success: false,
      message: "Error getting sensor data!",
      error: error.message,
    });
  }
};

// Tạo dữ liệu cảm biến mới
const createDataSensor = async (data) => {
  try {
    const sensorData = await prisma.sensorData.create({
      data: {
        temperature: data.temperature,
        humidity: data.humidity,
        light: data.light,
        gas: data.gas || 0,
      },
    });

    // Lưu cảnh báo nếu gas > 70
    if (data.gas > 70) {
      await prisma.gasWarning.create({
        data: {
          gasValue: data.gas,
          createdAt: new Date(),
        },
      });
      console.log("Gas warning recorded:", data.gas);
    }

    return sensorData;
  } catch (error) {
    console.error("Error creating sensor data:", error);
    throw error;
  }
};

// Thêm hàm đếm số lần gas > 70 trong ngày
const getGasWarningCount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.sensor_data.count({
      where: {
        AND: [{ gas: { gt: 70 } }, { createdAt: { gte: today } }],
      },
    });

    // Đảm bảo trả về JSON
    res.json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error("Error counting gas warnings:", error);
    res.status(500).json({
      success: false,
      message: "Error counting gas warnings",
      error: error.message,
    });
  }
};

module.exports = {
  getDataSensors,
  createDataSensor,
  getGasWarningCount,
};
