import React, { useEffect, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./NewPage.css";
import ledOn from "./img/bongdenbat.jpg";
import ledOff from "./img/bongdentat.jpg";

const MAX_DATA_POINTS = 12;

// Component DeviceControl
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

const NewPage = () => {
  const [socket, setSocket] = useState(null);
  const [gasData, setGasData] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [dataStore, setDataStore] = useState(() => {
    const savedData = localStorage.getItem("gasChartData");
    return savedData
      ? JSON.parse(savedData)
      : {
          gasValues: [],
          times: [],
        };
  });

  const [deviceStates, setDeviceStates] = useState(() => {
    const savedDeviceStates = localStorage.getItem("gasDeviceStates");
    return savedDeviceStates
      ? JSON.parse(savedDeviceStates)
      : {
          gas_led: { status: false, loading: false },
        };
  });

  // Thêm hàm sendMessage
  const sendMessage = useCallback(
    (device, action) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        setDeviceStates((prev) => {
          const newStates = {
            ...prev,
            [device]: { ...prev[device], loading: true },
          };
          localStorage.setItem("gasDeviceStates", JSON.stringify(newStates));
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

  // Hàm lấy số lần cảnh báo từ BE
  const fetchWarningCount = async () => {
    try {
      // Log trước khi gọi API
      console.log("Fetching warning count...");

      const response = await fetch(
        "http://localhost:3001/table/data/gas/warnings/count"
      );
      const data = await response.json();

      // Log response
      console.log("API Response:", data);

      if (data.success) {
        setWarningCount(data.count);
        // Log sau khi set state
        console.log("Warning count updated to:", data.count);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // WebSocket setup
  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);

    newSocket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.topic === "esp32/sensors") {
          const gasValue = message.data.gas;
          console.log("Received gas value:", gasValue);
          setGasData(gasValue);

          if (gasValue > 70) {
            console.log("Gas value > 70, updating warning count...");
            await fetchWarningCount();
          }

          setDataStore((prev) => {
            const newDataStore = {
              gasValues: [...prev.gasValues, gasValue].slice(-MAX_DATA_POINTS),
              times: [...prev.times, new Date().toLocaleTimeString()].slice(
                -MAX_DATA_POINTS
              ),
            };
            localStorage.setItem("gasChartData", JSON.stringify(newDataStore));
            return newDataStore;
          });
        }

        // Xử lý trạng thái thiết bị
        if (message.topic && message.topic.includes("deviceStatus")) {
          const device = message.topic.split("/")[1];
          const status = message.data === "on";
          setDeviceStates((prev) => {
            const newStates = {
              ...prev,
              [device]: { status, loading: false },
            };
            localStorage.setItem("gasDeviceStates", JSON.stringify(newStates));
            return newStates;
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    // Fetch initial count
    console.log("Component mounted, fetching initial count...");
    fetchWarningCount();

    // Cập nhật định kỳ mỗi phút
    const intervalId = setInterval(() => {
      console.log("Interval triggered, fetching count...");
      fetchWarningCount();
    }, 60000);

    return () => {
      clearInterval(intervalId);
      newSocket.close();
    };
  }, []);

  // Chart configuration
  const dataChart = {
    labels: dataStore.times,
    datasets: [
      {
        label: "Gas Level",
        data: dataStore.gasValues,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
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
        max: 100,
      },
    },
  };

  // Gas Warning Box Component
  const GasWarningBox = ({ gasValue, warningCount }) => {
    const isWarning = gasValue > 70;

    return (
      <div className="gas-warning-container">
        <div className={`gas-warning-box ${isWarning ? "warning-active" : ""}`}>
          <div className="warning-content">
            <span className={`warning-icon ${isWarning ? "active" : ""}`}>
              ⚠️
            </span>
            <span className={`warning-text ${isWarning ? "active" : ""}`}>
              GAS MONITOR
            </span>
            <span className={`gas-value ${isWarning ? "active" : ""}`}>
              Current Level: {gasValue}
            </span>
          </div>
          <div className="warning-count">
            <span>Warnings today:</span>
            <span className={`count-number ${isWarning ? "active" : ""}`}>
              {warningCount}
            </span>
          </div>
          <div className="warning-progress">
            <div
              className={`progress-bar ${isWarning ? "warning" : ""}`}
              style={{ width: `${Math.min(gasValue, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <h2>Gas Monitoring System</h2>

      <GasWarningBox gasValue={gasData} warningCount={warningCount} />

      <table className="centered-table">
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: `rgba(255, 99, 132, ${Math.min(
                  gasData / 100,
                  1
                )})`,
              }}
            >
              Gas Level 🌡️
              <br />
              {gasData}
            </th>
            <th>Device Control</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="chart-cell">
              <div className="chart-container">
                <Line data={dataChart} options={chartOptions} />
              </div>
            </td>
            <td>
              <div className="device-controls">
                <DeviceControl
                  name="gas_led"
                  label="Gas Warning LED"
                  imageOn={ledOn}
                  imageOff={ledOff}
                  state={deviceStates.gas_led}
                  onChange={(checked) =>
                    sendMessage("gas_led", checked ? "on" : "off")
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

export default NewPage;
