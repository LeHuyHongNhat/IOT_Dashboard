import React, { useEffect, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./Dashboard.css";
import quatchay from "./img/quatchay.jpg";
import quatdungyen from "./img/quatdungyen.jpg";
import dieuhoabat from "./img/dieuhoabat.jpg";
import dieuhoatat from "./img/dieuhoatat.jpg";
import bongdenbat from "./img/bongdenbat.jpg";
import bongdentat from "./img/bongdentat.jpg";

const MAX_DATA_POINTS = 12;

const Dashboard = () => {
  const [socket, setSocket] = useState(null);

  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
    gas: 0,
  });

  const [dataStore, setDataStore] = useState(() => {
    const savedData = localStorage.getItem("chartData");
    return savedData
      ? JSON.parse(savedData)
      : {
          temperatures: [],
          humiditys: [],
          lights: [],
          times: [],
        };
  });

  const [deviceStates, setDeviceStates] = useState(() => {
    const savedDeviceStates = localStorage.getItem("deviceStates");
    return savedDeviceStates
      ? JSON.parse(savedDeviceStates)
      : {
          fan: { status: false, loading: false },
          air_conditioner: { status: false, loading: false },
          led: { status: false, loading: false },
        };
  });

  // Khai báo state cho cảnh báo gas
  const [isGasWarning, setIsGasWarning] = useState(false);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const dataChart1 = {
    labels: dataStore.times,
    datasets: [
      {
        label: "Temperature (°C)",
        data: dataStore.temperatures,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Humidity (%)",
        data: dataStore.humiditys,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  const dataChart2 = {
    labels: dataStore.times,
    datasets: [
      {
        label: "Light (nits)",
        data: dataStore.lights,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const sendMessage = useCallback(
    (device, action) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        setDeviceStates((prev) => {
          const newStates = {
            ...prev,
            [device]: { ...prev[device], loading: true },
          };
          localStorage.setItem("deviceStates", JSON.stringify(newStates));
          return newStates;
        });
        socket.send(
          JSON.stringify({
            topic: `action/${device}`,
            message: action,
          })
        );
      }
    },
    [socket]
  );

  useEffect(() => {
    const connectWebSocket = () => {
      const newSocket = new WebSocket("ws://localhost:8080");

      newSocket.onopen = () => {
        console.log("WebSocket connected");
        newSocket.send(JSON.stringify({ topic: "getDeviceStatus" }));
      };

      newSocket.onclose = () => {
        console.log("WebSocket disconnected");
        // Thử kết nối lại sau 5 giây
        setTimeout(connectWebSocket, 5000);
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Thêm xử lý message đã sửa ở trên
      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Received WebSocket message:", message);

          // Kiểm tra cấu trúc message
          if (!message.topic) {
            console.error("Invalid message format:", message);
            return;
          }

          if (message.topic === "esp32/sensors") {
            // Cập nhật dữ liệu sensor
            const sensorData = message.data;
            setData(sensorData);

            // Cập nhật trạng thái cảnh báo gas
            setIsGasWarning(sensorData.gas > 70);

            setDataStore((prev) => {
              const newDataStore = {
                temperatures: [
                  ...prev.temperatures,
                  sensorData.temperature,
                ].slice(-MAX_DATA_POINTS),
                humiditys: [...prev.humiditys, sensorData.humidity].slice(
                  -MAX_DATA_POINTS
                ),
                lights: [...prev.lights, sensorData.light].slice(
                  -MAX_DATA_POINTS
                ),
                times: [...prev.times, new Date().toLocaleTimeString()].slice(
                  -MAX_DATA_POINTS
                ),
              };
              localStorage.setItem("chartData", JSON.stringify(newDataStore));
              return newDataStore;
            });
          } else if (message.topic.startsWith("deviceStatus/")) {
            // Cập nhật trạng thái thiết bị
            const device = message.topic.split("/")[1];
            const status = message.data === "on";
            setDeviceStates((prev) => {
              const newStates = {
                ...prev,
                [device]: { status, loading: false },
              };
              localStorage.setItem("deviceStates", JSON.stringify(newStates));
              return newStates;
            });
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    };

    connectWebSocket();
  }, []);

  const getBackgroundColor = (value, max, color) => {
    const intensity = Math.min(value / max, 1);
    return `rgba(${color}, ${intensity})`;
  };

  const GasWarning = ({ isWarning }) => {
    return (
      <div className={`gas-warning-box ${isWarning ? "warning-active" : ""}`}>
        <span className="warning-icon">⚠️</span>
        <span className="warning-text">GAS WARNING!</span>
        {isWarning && <span className="gas-value">Gas Level: {data.gas}</span>}
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Thêm GasWarning vào đầu dashboard */}
      <GasWarning isWarning={isGasWarning} />

      <h2>Dashboard</h2>

      <table className="centered-table">
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: getBackgroundColor(
                  data.temperature,
                  50,
                  "255, 99, 132"
                ),
              }}
            >
              Temperature 🌡️
              <br />
              {data.temperature}°C
            </th>
            <th
              style={{
                backgroundColor: getBackgroundColor(
                  data.humidity,
                  100,
                  "54, 162, 235"
                ),
              }}
            >
              Humidity 💧
              <br />
              {data.humidity}%
            </th>
            <th
              style={{
                backgroundColor: getBackgroundColor(
                  data.light,
                  1000,
                  "255, 206, 86"
                ),
              }}
            >
              Light ☀️
              <br />
              {data.light} nits
            </th>
            <th>Device</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="2" className="chart-cell">
              <div className="chart-container">
                <Line data={dataChart1} options={chartOptions} />
              </div>
            </td>
            <td className="chart-cell">
              <div className="chart-container">
                <Line data={dataChart2} options={chartOptions} />
              </div>
            </td>
            <td>
              <div className="device-controls">
                <DeviceControl
                  name="fan"
                  label="Fan"
                  imageOn={quatchay}
                  imageOff={quatdungyen}
                  state={deviceStates.fan}
                  onChange={(checked) =>
                    sendMessage("fan", checked ? "on" : "off")
                  }
                />
                <DeviceControl
                  name="air_conditioner"
                  label="Air Conditioner"
                  imageOn={dieuhoabat}
                  imageOff={dieuhoatat}
                  state={deviceStates.air_conditioner}
                  onChange={(checked) =>
                    sendMessage("air_conditioner", checked ? "on" : "off")
                  }
                />
                <DeviceControl
                  name="led"
                  label="LED"
                  imageOn={bongdenbat}
                  imageOff={bongdentat}
                  state={deviceStates.led}
                  onChange={(checked) =>
                    sendMessage("led", checked ? "on" : "off")
                  }
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const DeviceControl = ({ name, label, imageOn, imageOff, state, onChange }) => {
  return (
    <div className="device-item">
      <img
        src={state.status ? imageOn : imageOff}
        alt={label}
        className="device-image"
      />
      <label className={`switch ${state.loading ? "loading" : ""}`}>
        <input
          type="checkbox"
          checked={state.status}
          onChange={(e) => onChange(e.target.checked)}
          disabled={state.loading}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default Dashboard;
