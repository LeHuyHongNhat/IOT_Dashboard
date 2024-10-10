import React, { useState, useEffect } from "react";
import axiosClient from "./axios-client";
import { createQueryString, mappingActionHistory } from "./util";
import "./ActionHistory.css";

const ActionHistory = () => {
  const [data, setData] = useState();
  const [totalPage, setTotalPage] = useState();
  const [filter, setFilter] = useState({
    searchBy: "ALL",
    time: "",
  });

  const [page, setPage] = useState({
    page: 1,
    pageSize: 10,
    sortBy: null,
    orderBy: null,
  });

  const getSensorData = async () => {
    const queryString = createQueryString(filter, page);
    const sensorDatas = await axiosClient.get(`/table/action${queryString}`);
    setData(mappingActionHistory(sensorDatas.data));
    setTotalPage(Math.ceil(sensorDatas.meta.totalCount / page.pageSize));
  };

  useEffect(() => {
    getSensorData();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPage) {
      setPage((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  return (
    <div className="container">
      <h2>Action History</h2>
      <div className="search-container-wrapper">
        <div className="search-container">
          <select
            value={filter.searchBy}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, searchBy: e.target.value }))
            }
          >
            <option value="ALL">ALL</option>
            <option value="FAN">FAN</option>
            <option value="LED">LED</option>
            <option value="AIR_CONDITIONER">AIR CONDITIONER</option>
          </select>
          <input
            type="text"
            placeholder="Time (hh:mm:ss dd/mm/yyyy)"
            value={filter.time}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, time: e.target.value }))
            }
            className="search-box"
          />
          <button onClick={getSensorData}>Search</button>
        </div>
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
            onChange={(e) =>
              setPage((prev) => ({ ...prev, pageSize: Number(e.target.value) }))
            }
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

export default ActionHistory;
