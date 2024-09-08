import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ActionHistory = () => {
  const historyData = [
    { id: 1, device: "Fan", status: "On", time: "2024-08-25 09:45" },
    { id: 2, device: "Light", status: "Off", time: "2024-08-25 09:50" },
    {
      id: 3,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 09:55",
    },
    { id: 4, device: "Fan", status: "Off", time: "2024-08-25 10:00" },
    { id: 5, device: "Light", status: "On", time: "2024-08-25 10:05" },
    {
      id: 6,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 10:10",
    },
    { id: 7, device: "Fan", status: "On", time: "2024-08-25 10:15" },
    { id: 8, device: "Light", status: "Off", time: "2024-08-25 10:20" },
    {
      id: 9,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 10:25",
    },
    { id: 10, device: "Fan", status: "Off", time: "2024-08-25 10:30" },
    { id: 11, device: "Light", status: "On", time: "2024-08-25 10:35" },
    {
      id: 12,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 10:40",
    },
    { id: 13, device: "Fan", status: "On", time: "2024-08-25 10:45" },
    { id: 14, device: "Light", status: "Off", time: "2024-08-25 10:50" },
    {
      id: 15,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 10:55",
    },
    { id: 16, device: "Fan", status: "Off", time: "2024-08-25 11:00" },
    { id: 17, device: "Light", status: "On", time: "2024-08-25 11:05" },
    {
      id: 18,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 11:10",
    },
    { id: 19, device: "Fan", status: "On", time: "2024-08-25 11:15" },
    { id: 20, device: "Light", status: "Off", time: "2024-08-25 11:20" },
    {
      id: 21,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 11:25",
    },
    { id: 22, device: "Fan", status: "Off", time: "2024-08-25 11:30" },
    { id: 23, device: "Light", status: "On", time: "2024-08-25 11:35" },
    {
      id: 24,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 11:40",
    },
    { id: 25, device: "Fan", status: "On", time: "2024-08-25 11:45" },
    { id: 26, device: "Light", status: "Off", time: "2024-08-25 11:50" },
    {
      id: 27,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 11:55",
    },
    { id: 28, device: "Fan", status: "Off", time: "2024-08-25 12:00" },
    { id: 29, device: "Light", status: "On", time: "2024-08-25 12:05" },
    {
      id: 30,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 12:10",
    },
    { id: 31, device: "Fan", status: "On", time: "2024-08-25 12:15" },
    { id: 32, device: "Light", status: "Off", time: "2024-08-25 12:20" },
    {
      id: 33,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 12:25",
    },
    { id: 34, device: "Fan", status: "Off", time: "2024-08-25 12:30" },
    { id: 35, device: "Light", status: "On", time: "2024-08-25 12:35" },
    {
      id: 36,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 12:40",
    },
    { id: 37, device: "Fan", status: "On", time: "2024-08-25 12:45" },
    { id: 38, device: "Light", status: "Off", time: "2024-08-25 12:50" },
    {
      id: 39,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 12:55",
    },
    { id: 40, device: "Fan", status: "Off", time: "2024-08-25 13:00" },
    { id: 41, device: "Light", status: "On", time: "2024-08-25 13:05" },
    {
      id: 42,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 13:10",
    },
    { id: 43, device: "Fan", status: "On", time: "2024-08-25 13:15" },
    { id: 44, device: "Light", status: "Off", time: "2024-08-25 13:20" },
    {
      id: 45,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 13:25",
    },
    { id: 46, device: "Fan", status: "Off", time: "2024-08-25 13:30" },
    { id: 47, device: "Light", status: "On", time: "2024-08-25 13:35" },
    {
      id: 48,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 13:40",
    },
    { id: 49, device: "Fan", status: "On", time: "2024-08-25 13:45" },
    { id: 50, device: "Light", status: "Off", time: "2024-08-25 13:50" },
    {
      id: 51,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 13:55",
    },
    { id: 52, device: "Fan", status: "Off", time: "2024-08-25 14:00" },
    { id: 53, device: "Light", status: "On", time: "2024-08-25 14:05" },
    {
      id: 54,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 14:10",
    },
    { id: 55, device: "Fan", status: "On", time: "2024-08-25 14:15" },
    { id: 56, device: "Light", status: "Off", time: "2024-08-25 14:20" },
    {
      id: 57,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 14:25",
    },
    { id: 58, device: "Fan", status: "Off", time: "2024-08-25 14:30" },
    { id: 59, device: "Light", status: "On", time: "2024-08-25 14:35" },
    {
      id: 60,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 14:40",
    },
    { id: 61, device: "Fan", status: "On", time: "2024-08-25 14:45" },
    { id: 62, device: "Light", status: "Off", time: "2024-08-25 14:50" },
    {
      id: 63,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 14:55",
    },
    { id: 64, device: "Fan", status: "Off", time: "2024-08-25 15:00" },
    { id: 65, device: "Light", status: "On", time: "2024-08-25 15:05" },
    {
      id: 66,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 15:10",
    },
    { id: 67, device: "Fan", status: "On", time: "2024-08-25 15:15" },
    { id: 68, device: "Light", status: "Off", time: "2024-08-25 15:20" },
    {
      id: 69,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 15:25",
    },
    { id: 70, device: "Fan", status: "Off", time: "2024-08-25 15:30" },
    { id: 71, device: "Light", status: "On", time: "2024-08-25 15:35" },
    {
      id: 72,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 15:40",
    },
    { id: 73, device: "Fan", status: "On", time: "2024-08-25 15:45" },
    { id: 74, device: "Light", status: "Off", time: "2024-08-25 15:50" },
    {
      id: 75,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 15:55",
    },
    { id: 76, device: "Fan", status: "Off", time: "2024-08-25 16:00" },
    { id: 77, device: "Light", status: "On", time: "2024-08-25 16:05" },
    {
      id: 78,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 16:10",
    },
    { id: 79, device: "Fan", status: "On", time: "2024-08-25 16:15" },
    { id: 80, device: "Light", status: "Off", time: "2024-08-25 16:20" },
    {
      id: 81,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 16:25",
    },
    { id: 82, device: "Fan", status: "Off", time: "2024-08-25 16:30" },
    { id: 83, device: "Light", status: "On", time: "2024-08-25 16:35" },
    {
      id: 84,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 16:40",
    },
    { id: 85, device: "Fan", status: "On", time: "2024-08-25 16:45" },
    { id: 86, device: "Light", status: "Off", time: "2024-08-25 16:50" },
    {
      id: 87,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 16:55",
    },
    { id: 88, device: "Fan", status: "Off", time: "2024-08-25 17:00" },
    { id: 89, device: "Light", status: "On", time: "2024-08-25 17:05" },
    {
      id: 90,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 17:10",
    },
    { id: 91, device: "Fan", status: "On", time: "2024-08-25 17:15" },
    { id: 92, device: "Light", status: "Off", time: "2024-08-25 17:20" },
    {
      id: 93,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 17:25",
    },
    { id: 94, device: "Fan", status: "Off", time: "2024-08-25 17:30" },
    { id: 95, device: "Light", status: "On", time: "2024-08-25 17:35" },
    {
      id: 96,
      device: "Air Conditioner",
      status: "Off",
      time: "2024-08-25 17:40",
    },
    { id: 97, device: "Fan", status: "On", time: "2024-08-25 17:45" },
    { id: 98, device: "Light", status: "Off", time: "2024-08-25 17:50" },
    {
      id: 99,
      device: "Air Conditioner",
      status: "On",
      time: "2024-08-25 17:55",
    },
    { id: 100, device: "Fan", status: "Off", time: "2024-08-25 18:00" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [displayedData, setDisplayedData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchID, setSearchID] = useState("");

  useEffect(() => {
    let filteredData = historyData;

    if (startDate && endDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.time);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayedData(filteredData.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, itemsPerPage, startDate, endDate, searchID, historyData]);

  const totalPages = Math.ceil(historyData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <h2>Action History</h2>
      <div className="date-picker-container">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Start Date & Time"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="End Date & Time"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Device</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((action) => (
            <tr key={action.id}>
              <td>{action.id}</td>
              <td>{action.device}</td>
              <td>{action.status}</td>
              <td>{action.time.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default ActionHistory;
