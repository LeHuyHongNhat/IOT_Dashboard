import React, { useEffect, useState } from "react";
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
  const [socket, setSocket] = useState();

  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
  })

  const [dataStore, setDataStore] = useState({
    temperatures: [],
    humiditys: [],
    lights: [],
    times: []
  })

  const [action, setAction] = useState({
    isOnLed: false,
    isOnAirConditioner: false,
    isOnFan: false,
  })

  const dataChart1 = {
    labels: ["0", "1", "2", "3", "4", "5", "6"],
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
    labels: ["0", "1", "2", "3", "4", "5", "6"],
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
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setSocket(socket)
    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socket.onmessage = (event) => {
      const { topic, data } = JSON.parse(event.data);
      if (topic === 'sensorData') {
        setData(data);
        setDataStore((stage) => {
          return {
            temperatures: [...stage.temperatures, data.temperature].slice(-7),
            humiditys: [...stage.humiditys, data.humidity].slice(-7),
            lights: [...stage.lights, data.light].slice(-7),
            times: [...stage.times, data.createdAt].slice(-7),
          };
        })
      }
    };

    return () => {
      socket.close();
    };
  }, [])

  const sendMessage = (data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  };


  const getBackgroundColor = (value, max, color) => {
    const intensity = Math.min(value / max, 1);
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
                <div className="device-item">
                  <img
                    src={action.isOnFan ? quatchay : quatdungyen}
                    alt="Fan"
                    className="device-image"
                  />
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={action.isOnFan}
                      onChange={(e) => {
                        setAction((prev)=>({
                          ...prev,
                          isOnFan: e.target.checked
                        }));
                        sendMessage({
                          topic: 'action/fan',
                          message: e.target.checked ? 'on' : 'off'
                        })
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="device-item">
                  <img
                    src={action.isOnAirConditioner ? dieuhoabat : dieuhoatat}
                    alt="Air Conditioner"
                    className="device-image"
                  />
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={action.isOnAirConditioner}
                      onChange={(e) => {
                        setAction((prev)=>({
                          ...prev,
                          isOnAirConditioner: e.target.checked
                        }));
                        sendMessage({
                          topic: 'action/air_conditioner',
                          message: e.target.checked ? 'on' : 'off'
                        })
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="device-item">
                  <img
                    src={action.isOnLed ? bongdenbat : bongdentat}
                    alt="Light"
                    className="device-image"
                  />
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={action.isOnLed}
                      onChange={(e) => {
                        setAction((prev)=>({
                          ...prev,
                          isOnLed: e.target.checked
                        }));
                        sendMessage({
                          topic: 'action/led',
                          message: e.target.checked ? 'on' : 'off'
                        })
                      }}
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
