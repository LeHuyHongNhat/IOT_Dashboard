import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { DatePicker } from "antd";
import axiosClient from "./axios-client";
import { createQueryString, mappingActionHistory } from "./util";

const { RangePicker } = DatePicker;
const ActionHistory = () => {
  const [data, setData] = useState();
  const [totalPage, setTotalPage] = useState();
  const [filter, setFilter] = useState({
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
    const sensorDatas = await axiosClient.get(`/table/action${queryString}`);
    setData(mappingActionHistory(sensorDatas.data));
    setTotalPage(Math.ceil(sensorDatas.meta.totalCount / page.pageSize))
  }

  useEffect(() => {
    getSensorData();
  }, [page])

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPage) {
      setPage((prev) => ({
        ...prev,
        page: newPage
      }));
    }
  };


  return (
    <div className="container">
      <h2>Action History</h2>
      <div className="date-picker-container">
        <select value={filter.searchBy} onChange={(e) => {
          setFilter((prev) => ({
            ...prev,
            searchBy: e.target.value
          }))
        }}>
          <option value={'ALL'}>Tất cả</option>
          <option value={'FAN'}>Quạt</option>
          <option value={'LED'}>Đèn</option>
          <option value={'AIR_CONDITIONER'}>Điều hoà</option>
        </select>
        <RangePicker
          showTime
          onChange={(_time, timeString) => setFilter((prev) => ({
            ...prev,
            startTime: timeString[0],
            endTime: timeString[1]
          }))}
        />
        <button onClick={() => getSensorData()}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Device</th>
            <th>Hành động</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((action) => (
            <tr key={action.id}>
              <td>{action.id}</td>
              <td>{action.device}</td>
              <td>{action.action}</td>
              <td>{action.time.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default ActionHistory;
