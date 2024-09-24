import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./dataSensor.css";
import axiosClient from './axios-client';
import { createQueryString, mappingDataSensor } from "./util";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const DataSensorTable = () => {
  const [data, setData] = useState();
  const [totalPage, setTotalPage] = useState();
  const [filter, setFilter] = useState({
    content: null,
    searchBy: null,
    startTime: null,
    endTime: null,
  });

  const [page, setPage] = useState({
    page: 1,
    pageSize: 10,
    sortBy: null,
    orderBy: null
  })

  const getSensorData = async () => {
    const queryString = createQueryString(filter, page);
    const sensorDatas = await axiosClient.get(`/table/data${queryString}`);
    setData(mappingDataSensor(sensorDatas.data));
    setTotalPage(Math.ceil(sensorDatas.meta.totalCount/page.pageSize))
  }

  useEffect(() => {
    // console.log("🚀 ~ DataSensorTable ~ filter:", filter)
    console.log("🚀 ~ DataSensorTable ~ page:", page)
    getSensorData();
  }, [page])

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPage) {
      setPage((prev)=>({
        ...prev,
        page: newPage
      }));
    }
  };

  const requestSort = (key) => {
    // let direction = "ascending";
    // if (sortConfig.key === key && sortConfig.direction === "ascending") {
    //   direction = "descending";
    // } else if (
    //   sortConfig.key === key &&
    //   sortConfig.direction === "descending"
    // ) {
    //   direction = null; // Reset sorting
    //   key = null;
    // }
    // setSortConfig({ key, direction });
  };

  return (
    <div className="container">
      <h2>Data Sensor</h2>


      {/* Khung tìm kiếm thời gian */}
      <div className="date-picker-container">
        <input
          type="text"
          placeholder="Search"
          value={filter.content}
          onChange={(e) => setFilter((prev) => ({
            ...prev,
            content: e.target.value
          }))}
          className="search-box"
        />
        <select value={filter.searchBy} onChange={(e) => {
          setFilter((prev) => ({
            ...prev,
            searchBy: e.target.value
          }))
        }}>
          <option value={'ALL'}>Tất cả</option>
          <option value={'ID'}>ID</option>
          <option value={'TEMPERATURE'}>Nhiệt độ</option>
          <option value={'HUMIDITY'}>Độ ẩm</option>
          <option value={'LIGHT'}>Ánh sáng</option>
        </select>
        <RangePicker
          showTime
          onChange={(_time, timeString) => setFilter((prev)=>({
            ...prev,
            startTime: timeString[0],
            endTime: timeString[1]
          }))}
        />
        <button onClick={() => getSensorData()}>Search</button>
      </div>

      {/* Bảng dữ liệu */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>
              <div className="header-container">

                <div className="header-text">
                  Temperature (°C)
                  <span className="sorting-arrows">
                    <span onClick={() => requestSort("temperature")}>▲</span>
                    <span onClick={() => requestSort("temperature")}>▼</span>
                  </span>
                </div>
              </div>
            </th>
            <th>
              <div className="header-container">
                <div className="header-text">
                  Humidity (%)
                  <span className="sorting-arrows">
                    <span onClick={() => requestSort("humidity")}>▲</span>
                    <span onClick={() => requestSort("humidity")}>▼</span>
                  </span>
                </div>
              </div>
            </th>
            <th>
              <div className="header-container">
                <div className="header-text">
                  Light (nits)
                  <span className="sorting-arrows">
                    <span onClick={() => requestSort("light")}>▲</span>
                    <span onClick={() => requestSort("light")}>▼</span>
                  </span>
                </div>
              </div>
            </th>
            <th>
              <div className="header-container">
                <div className="header-text">Time
                  <span className="sorting-arrows">
                    <span onClick={() => requestSort("light")}>▲</span>
                    <span onClick={() => requestSort("light")}>▼</span>
                  </span>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.temperature}</td>
              <td>{row.humidity}</td>
              <td>{row.light}</td>
              <td>{row.time.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phần phân trang */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page.page - 1)}
          disabled={page.page === 1}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {page.page} of {totalPage}{" "}
        </span>
        <button
          onClick={() => handlePageChange(page.page + 1)}
          disabled={page.page === totalPage}
        >
          Next
        </button>
        <select value={page.pageSize} onChange={(e) => {
          setPage((prev) => ({
            ...prev,
            pageSize: Number(e.target.value)
          }))
        }}>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

const DataSensor = () => {
  const [data, setData] = useState([
    {
      id: 1,
      temperature: 23,
      humidity: 45,
      light: 700,
      time: new Date("2024-08-25 10:00"),
    },
    {
      id: 2,
      temperature: 25,
      humidity: 54,
      light: 820,
      time: new Date("2024-08-25 10:05"),
    }
  ]);

  return <DataSensorTable data={data} />;
};

export default DataSensorTable;
