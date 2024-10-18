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
import axiosClient from "./axios-client";
import { convertUtcToVnTimeChart } from "./util";

const MAX_DATA_POINTS = 10;
let intervalId
const Dashboard = () => {
  const [socket, setSocket] = useState(null);
  const [count, setCount] = useState(0);

  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
    gas: 0
  });

  const [dataStore, setDataStore] = useState({
    temperatures: [],
    humiditys: [],
    lights: [],
    times: [],
    gass: []
  });

  const [loading, setLoading] = useState({
    isLoadingLed: false,
    isLoadingAirConditioner: false,
    isLoadingFan: false,
    isLoadingLamp: false,
  })

  const [deviceStates, setDeviceStates] = useState({
    isOnLed: false,
    isOnAirConditioner: false,
    isOnFan: false,
    isOnLamp: false,
  });

  useEffect(() => {
    const getCount = async () => {
      const res = await axiosClient.get('/data/count-data');
      setCount(res);
    }

    getCount();
  }, [])

  useEffect(() => {
    const get10dataLast = async () => {
      const dataLast = await axiosClient.get('/data/10-data-last');
      setDataStore(() => {
        return {
          temperatures: dataLast.data.map(d => d.temperature),
          humiditys: dataLast.data.map(d => d.humidity),
          lights: dataLast.data.map(d => d.light),
          times: dataLast.data.map(d => d.createdAt),
          gass: dataLast.data.map(d => d.gas)
        };
      });
      setData({
        temperature: dataLast.data[0].temperature,
        humidity: dataLast.data[0].humidity,
        light: dataLast.data[0].light,
        gas: dataLast.data[0].gas,
      });
    }

    get10dataLast();
  }, [])



  useEffect(() => {
    const getActionLast = async () => {
      const actionLast = await axiosClient.get('/data/action/last');
      setDeviceStates(() => {
        const action = {
          isOnLed: actionLast.led == 'ON',
          isOnAirConditioner: actionLast.airConditioner == 'ON',
          isOnFan: actionLast.fan == 'ON',
          isOnLamp: actionLast.lamp == 'ON',
        }
        console.log("🚀 ~ setDeviceStates ~ action:", action)
        return action
      });
    }

    getActionLast();
  }, [])

  const dataChart1 = {
    labels: dataStore?.times.map(time => convertUtcToVnTimeChart(time)),

    datasets: [
      {
        label: "Temperature (°C)",
        data: dataStore?.temperatures || [100, 200, 300],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Humidity (%)",
        data: dataStore?.humiditys,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  const dataChart2 = {
    labels: dataStore?.times.map(time => convertUtcToVnTimeChart(time)),
    datasets: [
      {
        label: "Light (nits)",
        data: dataStore?.lights,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: true,
      },
      {
        label: "Độ bụi ",
        data: dataStore?.gass,
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
        setLoading((prev) => {
          const newStates = {
            ...prev,
            [device]: !prev[device]
          };
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
    const newSocket = new WebSocket("ws://localhost:8080");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
      // Khi kết nối lại, gửi yêu cầu cập nhật trạng thái thiết bị
      newSocket.send(JSON.stringify({ topic: "getDeviceStatus" }));
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    newSocket.onmessage = (event) => {
      const { topic, data } = JSON.parse(event.data);
      if (topic === "sensorData") {
        setData(data);
        setDataStore((prev) => {
          const newDataStore = {
            temperatures: [...prev.temperatures, data.temperature].slice(
              -MAX_DATA_POINTS
            ),
            humiditys: [...prev.humiditys, data.humidity].slice(
              -MAX_DATA_POINTS
            ),
            lights: [...prev.lights, data.light].slice(-MAX_DATA_POINTS),
            gass: [...prev.gass, data.gas].slice(-MAX_DATA_POINTS),
            times: [...prev.times, data.createdAt].slice(
              -MAX_DATA_POINTS
            ),
          };
          return newDataStore;
        });
      } else if (topic == 'ledok') {
        setLoading((prev) => {
          return {
            ...prev,
            isLoadingLed: !prev.isLoadingLed
          }
        })
        setDeviceStates((prev) => {
          return {
            ...prev,
            isOnLed: data == 'on'
          }
        });
      }
      else if (topic == 'fanOk') {
        setLoading((prev) => {
          return {
            ...prev,
            isLoadingFan: !prev.isLoadingFan
          }
        })
        setDeviceStates((prev) => {
          return {
            ...prev,
            isOnFan: data == 'on'
          }
        });
      } else if (topic == 'airConditionerOk') {
        setLoading((prev) => {
          return {
            ...prev,
            isLoadingAirConditioner: !prev.isLoadingAirConditioner
          }
        })
        setDeviceStates((prev) => {
          return {
            ...prev,
            isOnAirConditioner: data == 'on'
          }
        });
      } else if (topic == 'lampOk') {
        setLoading((prev) => {
          return {
            ...prev,
            isLoadingLamp: !prev.isLoadingLamp
          }
        })
        setDeviceStates((prev) => {
          return {
            ...prev,
            isOnLamp: data == 'on'
          }
        });
      } else if (topic == 'warning') {
        if (data == 'on') {
          intervalId = setInterval(() => {
            setDeviceStates((prev) => {
              return {
                ...prev,
                isOnLamp: !prev.isOnLamp
              }
            })
          }, 200)
        } else if (data == 'off') {
          clearInterval(intervalId)
          setDeviceStates((prev) => {
            return {
              ...prev,
              isOnLamp: false
            }
          })
        }
      }
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const getBackgroundColor = (value, max, color) => {
    const intensity = Math.min(value / max, 1);
    return `rgba(${color}, ${intensity})`;
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <p>Số lần cảnh báo vượt 800: {count}</p>

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
            <th
              style={{
                backgroundColor: getBackgroundColor(
                  data.gas,
                  1000,
                  "255, 206, 86"
                ),
              }}
            >
              Độ bụi ☀️
              <br />
              {data.gas} ??
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
            <td colSpan="2" className="chart-cell">
              <div className="chart-container">
                <Line data={dataChart2} options={chartOptions} />
              </div>
            </td>
            <td>
              <div className="device-controls">
                <DeviceControl
                  name="fan"
                  label="Fan"
                  isLoading={loading.isLoadingFan}
                  imageOn={quatchay}
                  imageOff={quatdungyen}
                  state={deviceStates.isOnFan}
                  onChange={(checked) =>
                    sendMessage("isLoadingFan", checked ? "on" : "off")
                  }
                />
                <DeviceControl
                  name="airConditioner"
                  label="Air Conditioner"
                  isLoading={loading.isLoadingAirConditioner}
                  imageOn={dieuhoabat}
                  imageOff={dieuhoatat}
                  state={deviceStates.isOnAirConditioner}
                  onChange={(checked) =>
                    sendMessage("isLoadingAirConditioner", checked ? "on" : "off")
                  }
                />
                <DeviceControl
                  name="led"
                  label="LED"
                  isLoading={loading.isLoadingLed}
                  imageOn={bongdenbat}
                  imageOff={bongdentat}
                  state={deviceStates.isOnLed}
                  onChange={(checked) =>
                    sendMessage("isLoadingLed", checked ? "on" : "off")
                  }
                />
                <DeviceControl
                  name="lamp"
                  label="LAMP"
                  imageOn={bongdenbat}
                  imageOff={bongdentat}
                  isLoading={loading.isLoadingLamp}
                  state={deviceStates.isOnLamp}
                  onChange={(checked) =>
                    sendMessage("isLoadingLamp", checked ? "on" : "off")
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

const DeviceControl = ({ name, isLoading, label, imageOn, imageOff, state, onChange }) => {
  return (
    <div className="device-item">
      <img
        src={state ? imageOn : imageOff}
        alt={label}
        className="device-image"
      />
      <label className={`switch ${isLoading ? "loading" : ""}`}>
        <input
          type="checkbox"
          checked={state}
          onChange={(e) => onChange(e.target.checked)}
          disabled={isLoading}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default Dashboard;
