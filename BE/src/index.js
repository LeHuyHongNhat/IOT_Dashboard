const express = require('express');
const morgan = require('morgan');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const router = require('./routes/index.js');
const dataSensorModel = require('./models/dataSensor.js');
const scheduleCronJobs = require('./controllers/cron.js');
const actionHistoryModel = require('./models/actionHistory.js');
const app = express();
const port = 3001; // port backend
const cors = require('cors');

require('dotenv').config();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
  })
);
app.use(morgan('dev')); //bắn log api gọi đến server

router(app); // routing của server

scheduleCronJobs();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Kết nối đến MQTT broker
const mqttClient = mqtt.connect(`mqtt://${process.env.HOST_LOCAL}`);

// Tạo WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', (ws, req) => {
  console.log(`Client connected`);

  // Thêm client vào danh sách
  clients.push(ws);

  // Loại bỏ client nếu kết nối bị đóng
  ws.on('close', () => {
    clients = clients.filter((client) => client !== ws);
  });

  // (Tùy chọn) In thông tin khi có lỗi xảy ra
  ws.on('error', (error) => {
    console.error(`WebSocket error:`, error);
  });

  // (Tùy chọn) In thông tin khi có tin nhắn đến
  ws.on('message', async (data) => {
    console.log(`Received message: ${data}`);
    const { topic, message } = JSON.parse(data);
    mqttClient.publish(topic, message);
  });
});

const topics = ['esp32/sensors', 'ledOk', 'airConditionerOk', 'fanOk', 'lampOk', 'warning'];

mqttClient.on('connect', () => {
  topics.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (!err) {
        console.log('Subscribed to sensor data');
      }
    });
  });
});

mqttClient.on('message', async (topic, message) => {
  try {
    if (topic == 'esp32/sensors') {
      const data = JSON.parse(message.toString()); //Example:  { temperature: 33, humidity: 82, light: 440 }

      const gas = Math.floor(Math.random() * 1001);
      // Lưu dữ liệu vào MySQL
      const sensorData = {
        temperature: data.temperature,
        humidity: data.humidity,
        light: data.light,
        gas: data.gas || gas
      };

      // Lưu dữ liệu vào MySQL
      const savedData = await dataSensorModel.createDataSensor(sensorData);

      // Phát dữ liệu đến tất cả các client WebSocket đang kết nối
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: 'sensorData',
              data: savedData
            })
          ); // Gửi dữ liệu đã lưu đến client
        }
      });
    } else if (topic == 'ledOk') {
      let saveAction = {};
      saveAction.device = 'LED';
      saveAction.action = message.toString() === 'on' ? 'ON' : 'OFF';
      console.log('ledOk: ', message.toString());
      await actionHistoryModel.createActionHistory(saveAction);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: 'ledOk',
              data: message.toString()
            })
          ); // Gửi dữ liệu đã lưu đến client
        }
      });
    } else if (topic == 'airConditionerOk') {
      let saveAction = {};
      saveAction.device = 'AIR_CONDITIONER';
      saveAction.action = message.toString() === 'on' ? 'ON' : 'OFF';
      console.log('airConditionerOk: ', message.toString());
      await actionHistoryModel.createActionHistory(saveAction);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: 'airConditionerOk',
              data: message.toString()
            })
          ); // Gửi dữ liệu đã lưu đến client
        }
      });
    } else if (topic == 'fanOk') {
      let saveAction = {};
      saveAction.device = 'FAN';
      saveAction.action = message.toString() === 'on' ? 'ON' : 'OFF';
      console.log('fanOk: ', message.toString());
      await actionHistoryModel.createActionHistory(saveAction);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: 'fanOk',
              data: message.toString()
            })
          ); // Gửi dữ liệu đã lưu đến client
        }
      });
    } else if (topic == 'lampOk') {
      let saveAction = {};
      saveAction.device = 'LAMP';
      saveAction.action = message.toString() === 'on' ? 'ON' : 'OFF';
      console.log('lampOk: ', message.toString());
      await actionHistoryModel.createActionHistory(saveAction);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: 'lampOk',
              data: message.toString()
            })
          ); // Gửi dữ liệu đã lưu đến client
        }
      });
    } else if (topic == 'warning') {
      console.log('WARNING: ', message.toString());

      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              topic: 'warning',
              data: message.toString()
            })
          ); // Gửi dữ liệu đã lưu đến client
        }
      });
      for (let i = 0; i < 5; i++) {
        await actionHistoryModel.createActionHistory({
          device: 'LAMP',
          action: 'ON'
        });
        await actionHistoryModel.createActionHistory({
          device: 'LAMP',
          action: 'OFF'
        });
      }
    }
  } catch (error) {
    console.error('Error saving data or sending via WebSocket:', error);
  }
});
