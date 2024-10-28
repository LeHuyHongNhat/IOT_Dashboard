const express = require("express");
const morgan = require("morgan");
const mqtt = require("mqtt");
const WebSocket = require("ws");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const dataSensorModel = require("./models/dataSensor.js");
const scheduleCronJobs = require("./controllers/cron.js");
const app = express();
const port = 3001; // Cổng cho backend
const { Device, Action } = require("@prisma/client");
const actionHistoryModel = require("./models/actionHistory.js");
const route = require("./routes");

require("dotenv").config();

// Thêm đối tượng để lưu trữ trạng thái thiết bị
const deviceStates = {
  fan: false,
  air_conditioner: false,
  led: false,
};

// Thêm middleware để parse JSON
app.use(express.json());

// Cấu hình CORS cho phép truy cập từ frontend
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

route(app);

app.use(morgan("dev")); // Ghi log các yêu cầu API đến server

// WebSocket server
const wss = new WebSocket.Server({
  port: 8080,
  // Thêm xử lý lỗi cho WebSocket
  clientTracking: true,
  handleProtocols: () => true,
});

// Xử lý kết nối WebSocket
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Gửi message chào mừng
  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to WebSocket server",
    })
  );

  // Xử lý tin nhắn
  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data);
      console.log("Received:", message);

      // Xử lý message tùy theo loại
      if (message.type === "getDeviceStatus") {
        // Gửi trạng thái thiết bị
        ws.send(
          JSON.stringify({
            type: "deviceStatus",
            data: deviceStates,
          })
        );
      }
    } catch (error) {
      console.error("WebSocket message error:", error);
    }
  });

  // Xử lý đóng kết nối
  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Xử lý lỗi
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Xử lý lỗi cho WebSocket server
wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

// MQTT client
const mqttClient = mqtt.connect(`mqtt://${process.env.HOST_LOCAL}:1995`, {
  username: "lehuyhongnhat",
  password: "b21dccn575",
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
});

// Xử lý kết nối MQTT
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  const topics = ["esp32/sensors", "esp32/deviceStatus/#"];
  topics.forEach((topic) => {
    mqttClient.subscribe(topic);
  });
});

// Xử lý message MQTT
mqttClient.on("message", async (topic, message) => {
  if (topic === "esp32/sensors") {
    try {
      const data = JSON.parse(message.toString());
      const sensorData = await dataSensorModel.createDataSensor({
        temperature: data.temperature,
        humidity: data.humidity,
        light: data.light,
        gas: data.gas || 0,
      });

      // Gửi dữ liệu qua WebSocket với cấu trúc đúng
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: "sensorData",
              data: {
                temperature: sensorData.temperature,
                humidity: sensorData.humidity,
                light: sensorData.light,
                gas: sensorData.gas,
              },
            })
          );
        }
      });
    } catch (error) {
      console.error("Error processing sensor data:", error);
    }
  } else if (topic.startsWith("esp32/deviceStatus/")) {
    try {
      const device = topic.split("/").pop();
      const status = message.toString();

      // Gửi trạng thái thiết bị qua WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: `deviceStatus/${device}`,
              data: status,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error processing device status:", error);
    }
  }
});

// Thêm error handling cho MQTT client
mqttClient.on("error", (error) => {
  console.error("MQTT Error:", error);
});

mqttClient.on("close", () => {
  console.log("MQTT connection closed");
});

// Thêm error handling cho WebSocket server
wss.on("error", (error) => {
  console.error("WebSocket Server Error:", error);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Thêm error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error!",
    error: err.message,
  });
});

scheduleCronJobs(); // Lên lịch các công việc cron
