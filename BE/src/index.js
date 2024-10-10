const express = require("express");
const morgan = require("morgan");
const mqtt = require("mqtt");
const WebSocket = require("ws");
const router = require("./routes/index.js");
const dataSensorModel = require("./models/dataSensor.js");
const scheduleCronJobs = require("./controllers/cron.js");
const app = express();
const port = 3001; // port backend
const cors = require("cors");
const { Device, Action } = require("@prisma/client");
const actionHistoryModel = require("./models/actionHistory.js");

require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(morgan("dev")); //bắn log api gọi đến server

router(app); // routing của server

scheduleCronJobs();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Kết nối đến MQTT broker
const mqttClient = mqtt.connect(`mqtt://${process.env.HOST_LOCAL}`, {
  // username: "lehuyhongnhat", // Thêm username
  // password: "b21dccn575", // Thêm password
});

// Tạo WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on("connection", (ws, req) => {
  console.log(`Client connected`);

  // Thêm client vào danh sách
  clients.push(ws);

  // Loại bỏ client nếu kết nối bị đóng
  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });

  // (Tùy chọn) In thông tin khi có lỗi xảy ra
  ws.on("error", (error) => {
    console.error(`WebSocket error:`, error);
  });

  // (Tùy chọn) In thông tin khi có tin nhắn đến
  ws.on("message", async (data) => {
    console.log(`Received message: ${data}`);
    const { topic, message } = JSON.parse(data);

    let xxxx = {};
    if (topic == "action/air_conditioner") {
      (xxxx.device = Device.AIR_CONDITIONER),
        (xxxx.action = message == "on" ? Action.ON : Action.OFF);
    }
    if (topic == "action/fan") {
      (xxxx.device = Device.FAN),
        (xxxx.action = message == "on" ? Action.ON : Action.OFF);
    }
    if (topic == "action/led") {
      (xxxx.device = Device.LED),
        (xxxx.action = message == "on" ? Action.ON : Action.OFF);
    }
    await actionHistoryModel.createActionHistory(xxxx);
    mqttClient.publish(topic, message);
  });
});

const topics = ["esp32/sensors"];

mqttClient.on("connect", () => {
  topics.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (!err) {
        console.log("Subscribed to sensor data");
      }
    });
  });
});

mqttClient.on("message", async (topic, message) => {
  try {
    if (topic == "esp32/sensors") {
      const data = JSON.parse(message.toString()); //Example:  { temperature: 33, humidity: 82, light: 440 }
      // Lưu dữ liệu vào MySQL
      const savedData = await dataSensorModel.createDataSensor(data);

      // Phát dữ liệu đến tất cả các client WebSocket đang kết nối
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: "sensorData",
              data: savedData,
            })
          ); // Gửi dữ liệu đã lưu đến client
        }
      });
    }
  } catch (error) {
    console.error("Error saving data or sending via WebSocket:", error);
  }
});
