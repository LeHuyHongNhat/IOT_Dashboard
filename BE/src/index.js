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

// Thêm đối tượng để lưu trữ trạng thái thiết bị
const deviceStates = {
  fan: false,
  air_conditioner: false,
  led: false,
};

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

    if (topic === "getDeviceStatus") {
      // Gửi trạng thái hiện tại của tất cả các thiết bị
      Object.entries(deviceStates).forEach(([device, status]) => {
        ws.send(
          JSON.stringify({
            topic: `deviceStatus/${device}`,
            data: status ? "on" : "off",
          })
        );
      });
    } else {
      let deviceAction = {};
      let deviceTopic = "";
      if (topic == "action/air_conditioner") {
        deviceAction.device = Device.AIR_CONDITIONER;
        deviceTopic = "air_conditioner";
      } else if (topic == "action/fan") {
        deviceAction.device = Device.FAN;
        deviceTopic = "fan";
      } else if (topic == "action/led") {
        deviceAction.device = Device.LED;
        deviceTopic = "led";
      }
      deviceAction.action = message == "on" ? Action.ON : Action.OFF;

      await actionHistoryModel.createActionHistory(deviceAction);
      mqttClient.publish(topic, message);

      // Cập nhật trạng thái thiết bị
      deviceStates[deviceTopic] = message === "on";

      // Giả lập phản hồi từ hardware sau 1 giây
      setTimeout(() => {
        const statusTopic = `esp32/deviceStatus/${deviceTopic}`;
        mqttClient.publish(statusTopic, message);
      }, 1500);
    }
  });
});

const topics = ["esp32/sensors", "esp32/deviceStatus/#"];

mqttClient.on("connect", () => {
  topics.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      }
    });
  });
});

mqttClient.on("message", async (topic, message) => {
  try {
    if (topic == "esp32/sensors") {
      const data = JSON.parse(message.toString());
      const savedData = await dataSensorModel.createDataSensor(data);

      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: "sensorData",
              data: savedData,
            })
          );
        }
      });
    } else if (topic.startsWith("esp32/deviceStatus/")) {
      const device = topic.split("/")[2];
      const status = message.toString();

      // Cập nhật trạng thái thiết bị
      deviceStates[device] = status === "on";

      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: `deviceStatus/${device}`,
              data: status,
            })
          );
        }
      });
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});
