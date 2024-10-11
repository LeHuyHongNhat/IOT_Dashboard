import React, { useState, useEffect } from "react";
import axiosClient from "./axios-client";
import { createQueryString, mappingActionHistory } from "./util";
import "./ActionHistory.css";

const ActionHistory = () => {
  // State để lưu trữ dữ liệu lịch sử hành động
  const [data, setData] = useState();
  // State để lưu trữ tổng số trang
  const [totalPage, setTotalPage] = useState();
  // State để lưu trữ các điều kiện lọc
  const [filter, setFilter] = useState({
    searchBy: "ALL",
    time: "",
  });

  // State để lưu trữ thông tin phân trang và sắp xếp
  const [page, setPage] = useState({
    page: 1,
    pageSize: 10,
    sortBy: null,
    orderBy: null,
  });

  // Hàm để lấy dữ liệu lịch sử hành động từ server
  const getSensorData = async () => {
    // Tạo chuỗi query từ các điều kiện lọc và phân trang
    const queryString = createQueryString(filter, page);
    // Gọi API để lấy dữ liệu
    const sensorDatas = await axiosClient.get(`/table/action${queryString}`);
    // Cập nhật state với dữ liệu đã được xử lý
    setData(mappingActionHistory(sensorDatas.data));
    // Tính toán và cập nhật tổng số trang
    setTotalPage(Math.ceil(sensorDatas.meta.totalCount / page.pageSize));
  };

  // Gọi API mỗi khi thông tin phân trang thay đổi
  useEffect(() => {
    getSensorData();
  }, [page]);

  // Hàm xử lý khi thay đổi trang
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
      {/* Phần tìm kiếm và lọc */}
      <div className="search-container-wrapper">
        <div className="search-container">
          {/* Dropdown để chọn loại thiết bị */}
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
          {/* Ô input để nhập thời gian */}
          <input
            type="text"
            placeholder="Time (hh:mm:ss dd/mm/yyyy)"
            value={filter.time}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, time: e.target.value }))
            }
            className="search-box"
          />
          {/* Nút tìm kiếm */}
          <button onClick={getSensorData}>Search</button>
        </div>
      </div>
      {/* Bảng hiển thị dữ liệu */}
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
      {/* Phần phân trang */}
      <div className="pagination-wrapper">
        <div className="pagination">
          {/* Nút chuyển đến trang trước */}
          <button
            onClick={() => handlePageChange(page.page - 1)}
            disabled={page.page === 1}
            className="pagination-button"
          >
            &laquo; Previous
          </button>
          {/* Hiển thị thông tin trang hiện tại */}
          <span className="pagination-info">
            Page {page.page} of {totalPage}
          </span>
          {/* Nút chuyển đến trang sau */}
          <button
            onClick={() => handlePageChange(page.page + 1)}
            disabled={page.page === totalPage}
            className="pagination-button"
          >
            Next &raquo;
          </button>
        </div>
        {/* Dropdown để chọn số lượng item trên mỗi trang */}
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
