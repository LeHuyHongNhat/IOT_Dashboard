import React, { useEffect, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./WindMonitor.css";

const MAX_DATA_POINTS = 12;
const WIND_THRESHOLD = 60;

const WindMonitor = () => {
  const [socket, setSocket] = useState(null);
  const [windData, setWindData] = useState({
    wind: 0,
  });

  const [dataStore, setDataStore] = useState(() => {
    const savedData = localStorage.getItem("windChartData");
    return savedData
      ? JSON.parse(savedData)
      : {
          winds: [],
          times: [],
        };
  });

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const windChartData = {
    labels: dataStore.times,
    datasets: [
      {
        label: "Wind Speed (m/s)",
        data: dataStore.winds,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
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
        max: 100,
      },
    },
  };

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    newSocket.onmessage = (event) => {
      const { topic, data } = JSON.parse(event.data);
      if (topic === "sensorData") {
        setWindData({ wind: data.wind });
        setDataStore((prev) => {
          const newDataStore = {
            winds: [...prev.winds, data.wind].slice(-MAX_DATA_POINTS),
            times: [...prev.times, new Date().toLocaleTimeString()].slice(
              -MAX_DATA_POINTS
            ),
          };
          localStorage.setItem("windChartData", JSON.stringify(newDataStore));
          return newDataStore;
        });
      }
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const getBackgroundColor = (value) => {
    const intensity = Math.min(value / 100, 1);
    return `rgba(75, 192, 192, ${intensity})`;
  };

  return (
    <div className="wind-monitor-container">
      <h2>Wind Monitor</h2>

      <div className="monitor-grid">
        {/* Ô hiển thị giá trị gió */}
        <div
          className="wind-value-box"
          style={{
            backgroundColor: getBackgroundColor(windData.wind),
          }}
        >
          <h3>Wind Speed</h3>
          <div className="wind-value">
            {windData.wind}
            <span className="unit">m/s</span>
          </div>
        </div>

        {/* Ô hiển thị biểu đồ */}
        <div className="chart-box">
          <div className="chart-container">
            <Line data={windChartData} options={chartOptions} />
          </div>
        </div>

        {/* Ô cảnh báo */}
        <div
          className={`alert-box ${
            windData.wind >= WIND_THRESHOLD ? "warning" : ""
          }`}
        >
          <h3>Status</h3>
          <div className="alert-content">
            {windData.wind >= WIND_THRESHOLD ? (
              <>
                <span className="alert-icon">⚠️</span>
                <div className="alert-message">
                  WARNING!
                  <br />
                  Wind speed is too high!
                </div>
              </>
            ) : (
              <>
                <span className="alert-icon">✅</span>
                <div className="alert-message">
                  Normal
                  <br />
                  Wind speed is safe
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindMonitor;
