import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./dataSensor.css";
import axiosClient from "./axios-client";
import { createQueryString, mappingDataSensor } from "./util";

const DataSensorTable = () => {
  const [data, setData] = useState();
  const [totalPage, setTotalPage] = useState();
  const [filter, setFilter] = useState({
    content: "",
    searchBy: "ALL",
    time: "",
  });

  const [page, setPage] = useState({
    page: 1,
    pageSize: 10,
    sortBy: null,
    orderBy: null,
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const getActionHistory = async () => {
    const queryString = createQueryString(filter, page);
    const sensorDatas = await axiosClient.get(`/table/data${queryString}`);
    setData(mappingDataSensor(sensorDatas.data));
    setTotalPage(Math.ceil(sensorDatas.meta.totalCount / page.pageSize));
  };

  useEffect(() => {
    getActionHistory();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPage) {
      setPage((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = null;
      key = null;
    }
    setSortConfig({ key, direction });
    data.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setData(data);
  };

  return (
    <div className="container">
      <h2>Data Sensor</h2>

      {/* Khung tìm kiếm */}
      <div className="search-container-wrapper">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search (ID, Temperature, Humidity, Light, or Time)"
            value={filter.content}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            className="search-box"
          />
          <select
            value={filter.searchBy}
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                searchBy: e.target.value,
              }));
            }}
          >
            <option value="ALL">Tất cả</option>
            <option value="ID">ID</option>
            <option value="TEMPERATURE">Nhiệt độ</option>
            <option value="HUMIDITY">Độ ẩm</option>
            <option value="LIGHT">Ánh sáng</option>
            <option value="TIME">Thời gian</option>
          </select>
          <button onClick={() => getActionHistory()}>Search</button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <table>
        <thead>
          <tr>
            <th>
              ID
              <span className="sorting-arrows">
                <span onClick={() => requestSort("id")}>▲</span>
                <span onClick={() => requestSort("id")}>▼</span>
              </span>
            </th>
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
                <div className="header-text">
                  Time
                  <span className="sorting-arrows">
                    <span onClick={() => requestSort("time")}>▲</span>
                    <span onClick={() => requestSort("time")}>▼</span>
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
      <div className="pagination-wrapper">
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page.page - 1)}
            disabled={page.page === 1}
            className="pagination-button"
          >
            &laquo; Previous
          </button>
          <span className="pagination-info">
            Page {page.page} of {totalPage}
          </span>
          <button
            onClick={() => handlePageChange(page.page + 1)}
            disabled={page.page === totalPage}
            className="pagination-button"
          >
            Next &raquo;
          </button>
        </div>
        <div className="page-size-selector">
          <label htmlFor="pageSize">Items per page:</label>
          <select
            id="pageSize"
            value={page.pageSize}
            onChange={(e) => {
              setPage((prev) => ({
                ...prev,
                pageSize: Number(e.target.value),
              }));
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DataSensorTable;
