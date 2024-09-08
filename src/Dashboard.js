import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./Dashboard.css";
import quatchay from "./img/quatchay.jpg";
import quatdungyen from "./img/quatdungyen.jpg";
import dieuhoabat from "./img/dieuhoabat.jpg";
import dieuhoatat from "./img/dieuhoatat.jpg";
import bongdenbat from "./img/bongdenbat.jpg";
import bongdentat from "./img/bongdentat.jpg";

const Dashboard = () => {
  const [fanOn, setFanOn] = useState(false);
  const [acOn, setAcOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  const temperature = 45; // Giá trị nhiệt độ
  const humidity = 73; // Giá trị độ ẩm
  const light = 730; // Giá trị ánh sáng

  const data1 = {
    labels: ["0", "1", "2", "3", "4", "5", "6"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [23, 27, 32, 35, 41, 38, 27],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Humidity (%)",
        data: [50, 45, 25, 10, 52, 73, 89],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  const data2 = {
    labels: ["0", "1", "2", "3", "4", "5", "6"],
    datasets: [
      {
        label: "Light (nits)",
        data: [350, 450, 710, 730, 620, 440, 360],
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
      y: {
        beginAtZero: true,
      },
    },
  };

  const getBackgroundColor = (value, max, color) => {
    const intensity = Math.min(value / max, 1); // Đảm bảo giá trị từ 0 đến 1
    return `rgba(${color}, ${intensity})`;
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <table className="centered-table">
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: getBackgroundColor(
                  temperature,
                  50,
                  "255, 99, 132"
                ),
              }}
            >
              Temperature 🌡️
              <br />
              {temperature}°C
            </th>
            <th
              style={{
                backgroundColor: getBackgroundColor(
                  humidity,
                  100,
                  "54, 162, 235"
                ),
              }}
            >
              Humidity 💧
              <br />
              {humidity}%
            </th>
            <th
              style={{
                backgroundColor: getBackgroundColor(
                  light,
                  1000,
                  "255, 206, 86"
                ),
              }}
            >
              Light ☀️
              <br />
              {light} nits
            </th>
            <th>Device</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="2" className="chart-cell">
              <div className="chart-container">
                <Line data={data1} options={chartOptions} />
              </div>
            </td>
            <td className="chart-cell">
              <div className="chart-container">
                <Line data={data2} options={chartOptions} />
              </div>
            </td>
            <td>
              <div className="device-controls">
                <div className="device-item">
                  <img
                    src={fanOn ? quatchay : quatdungyen}
                    alt="Fan"
                    className="device-image"
                  />
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={fanOn}
                      onChange={() => setFanOn(!fanOn)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="device-item">
                  <img
                    src={lightOn ? bongdenbat : bongdentat}
                    alt="Light"
                    className="device-image"
                  />
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={lightOn}
                      onChange={() => setLightOn(!lightOn)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="device-item">
                  <img
                    src={acOn ? dieuhoabat : dieuhoatat}
                    alt="Air Conditioner"
                    className="device-image"
                  />
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={acOn}
                      onChange={() => setAcOn(!acOn)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
