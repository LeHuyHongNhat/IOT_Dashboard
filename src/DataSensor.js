import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./dataSensor.css";

const DataSensorTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [displayedData, setDisplayedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTemperature, setSearchTemperature] = useState("");
  const [searchHumidity, setSearchHumidity] = useState("");
  const [searchLight, setSearchLight] = useState("");
  const [searchTime, setSearchTime] = useState("");

  useEffect(() => {
    let filteredData = [...data];

    // Lọc theo khoảng thời gian
    if (startDate && endDate) {
      filteredData = filteredData.filter(
        (item) => item.time >= startDate && item.time <= endDate
      );
    }

    // Lọc theo các ô tìm kiếm riêng biệt
    if (searchTemperature) {
      filteredData = filteredData.filter((item) =>
        item.temperature.toString().includes(searchTemperature)
      );
    }

    if (searchHumidity) {
      filteredData = filteredData.filter((item) =>
        item.humidity.toString().includes(searchHumidity)
      );
    }

    if (searchLight) {
      filteredData = filteredData.filter((item) =>
        item.light.toString().includes(searchLight)
      );
    }

    if (searchTime) {
      filteredData = filteredData.filter((item) =>
        item.time.toLocaleString().includes(searchTime)
      );
    }

    // Sắp xếp
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    setDisplayedData(filteredData.slice(indexOfFirstItem, indexOfLastItem));
  }, [
    currentPage,
    itemsPerPage,
    data,
    sortConfig,
    startDate,
    endDate,
    searchTemperature,
    searchHumidity,
    searchLight,
    searchTime,
  ]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = null; // Reset sorting
      key = null;
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container">
      <h2>Data Sensor</h2>

      {/* Khung tìm kiếm thời gian */}
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

      {/* Bảng dữ liệu */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>
              <div className="header-container">
                <input
                  type="text"
                  placeholder="Search Temperature"
                  value={searchTemperature}
                  onChange={(e) => setSearchTemperature(e.target.value)}
                  className="search-box"
                />
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
                <input
                  type="text"
                  placeholder="Search Humidity"
                  value={searchHumidity}
                  onChange={(e) => setSearchHumidity(e.target.value)}
                  className="search-box"
                />
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
                <input
                  type="text"
                  placeholder="Search Light"
                  value={searchLight}
                  onChange={(e) => setSearchLight(e.target.value)}
                  className="search-box"
                />
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
                <input
                  type="text"
                  placeholder="Search Time"
                  value={searchTime}
                  onChange={(e) => setSearchTime(e.target.value)}
                  className="search-box"
                />
                <div className="header-text">Time</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row) => (
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
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          {" "}
          Page {currentPage} of {totalPages}{" "}
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
    },
    {
      id: 3,
      temperature: 24.5,
      humidity: 56,
      light: 790,
      time: new Date("2024-08-25 10:10"),
    },
    {
      id: 4,
      temperature: 24,
      humidity: 55,
      light: 800,
      time: new Date("2024-08-25 10:15"),
    },
    {
      id: 5,
      temperature: 23.5,
      humidity: 47,
      light: 710,
      time: new Date("2024-08-25 10:20"),
    },
    {
      id: 6,
      temperature: 24.2,
      humidity: 53,
      light: 750,
      time: new Date("2024-08-25 10:25"),
    },
    {
      id: 7,
      temperature: 23.8,
      humidity: 50,
      light: 730,
      time: new Date("2024-08-25 10:30"),
    },
    {
      id: 8,
      temperature: 24.1,
      humidity: 52,
      light: 740,
      time: new Date("2024-08-25 10:35"),
    },
    {
      id: 9,
      temperature: 24.7,
      humidity: 51,
      light: 765,
      time: new Date("2024-08-25 10:40"),
    },
    {
      id: 10,
      temperature: 24.4,
      humidity: 49,
      light: 780,
      time: new Date("2024-08-25 10:45"),
    },
    {
      id: 11,
      temperature: 23.9,
      humidity: 48,
      light: 730,
      time: new Date("2024-08-25 10:50"),
    },
    {
      id: 12,
      temperature: 24.6,
      humidity: 57,
      light: 810,
      time: new Date("2024-08-25 10:55"),
    },
    {
      id: 13,
      temperature: 24.3,
      humidity: 46,
      light: 720,
      time: new Date("2024-08-25 11:00"),
    },
    {
      id: 14,
      temperature: 25.1,
      humidity: 55,
      light: 800,
      time: new Date("2024-08-25 11:05"),
    },
    {
      id: 15,
      temperature: 24.9,
      humidity: 53,
      light: 815,
      time: new Date("2024-08-25 11:10"),
    },
    {
      id: 16,
      temperature: 24.0,
      humidity: 50,
      light: 740,
      time: new Date("2024-08-25 11:15"),
    },
    {
      id: 17,
      temperature: 24.2,
      humidity: 49,
      light: 735,
      time: new Date("2024-08-25 11:20"),
    },
    {
      id: 18,
      temperature: 23.7,
      humidity: 54,
      light: 780,
      time: new Date("2024-08-25 11:25"),
    },
    {
      id: 19,
      temperature: 24.8,
      humidity: 52,
      light: 800,
      time: new Date("2024-08-25 11:30"),
    },
    {
      id: 20,
      temperature: 24.5,
      humidity: 56,
      light: 790,
      time: new Date("2024-08-25 11:35"),
    },
    {
      id: 21,
      temperature: 23.6,
      humidity: 51,
      light: 710,
      time: new Date("2024-08-25 11:40"),
    },
    {
      id: 22,
      temperature: 25.0,
      humidity: 48,
      light: 820,
      time: new Date("2024-08-25 11:45"),
    },
    {
      id: 23,
      temperature: 24.4,
      humidity: 53,
      light: 760,
      time: new Date("2024-08-25 11:50"),
    },
    {
      id: 24,
      temperature: 24.7,
      humidity: 50,
      light: 780,
      time: new Date("2024-08-25 11:55"),
    },
    {
      id: 25,
      temperature: 24.6,
      humidity: 47,
      light: 770,
      time: new Date("2024-08-25 12:00"),
    },
    {
      id: 26,
      temperature: 23.9,
      humidity: 55,
      light: 750,
      time: new Date("2024-08-25 12:05"),
    },
    {
      id: 27,
      temperature: 24.1,
      humidity: 52,
      light: 730,
      time: new Date("2024-08-25 12:10"),
    },
    {
      id: 28,
      temperature: 23.8,
      humidity: 49,
      light: 700,
      time: new Date("2024-08-25 12:15"),
    },
    {
      id: 29,
      temperature: 25.2,
      humidity: 54,
      light: 810,
      time: new Date("2024-08-25 12:20"),
    },
    {
      id: 30,
      temperature: 24.5,
      humidity: 56,
      light: 795,
      time: new Date("2024-08-25 12:25"),
    },
    {
      id: 31,
      temperature: 24.3,
      humidity: 51,
      light: 765,
      time: new Date("2024-08-25 12:30"),
    },
    {
      id: 32,
      temperature: 24.7,
      humidity: 49,
      light: 750,
      time: new Date("2024-08-25 12:35"),
    },
    {
      id: 33,
      temperature: 24.9,
      humidity: 55,
      light: 800,
      time: new Date("2024-08-25 12:40"),
    },
    {
      id: 34,
      temperature: 24.2,
      humidity: 52,
      light: 740,
      time: new Date("2024-08-25 12:45"),
    },
    {
      id: 35,
      temperature: 24.6,
      humidity: 51,
      light: 770,
      time: new Date("2024-08-25 12:50"),
    },
    {
      id: 36,
      temperature: 25.0,
      humidity: 53,
      light: 785,
      time: new Date("2024-08-25 12:55"),
    },
    {
      id: 37,
      temperature: 24.5,
      humidity: 48,
      light: 760,
      time: new Date("2024-08-25 13:00"),
    },
    {
      id: 38,
      temperature: 24.8,
      humidity: 50,
      light: 740,
      time: new Date("2024-08-25 13:05"),
    },
    {
      id: 39,
      temperature: 24.9,
      humidity: 54,
      light: 755,
      time: new Date("2024-08-25 13:10"),
    },
    {
      id: 40,
      temperature: 24.3,
      humidity: 52,
      light: 765,
      time: new Date("2024-08-25 13:15"),
    },
    {
      id: 41,
      temperature: 24.7,
      humidity: 49,
      light: 780,
      time: new Date("2024-08-25 13:20"),
    },
    {
      id: 42,
      temperature: 24.6,
      humidity: 50,
      light: 740,
      time: new Date("2024-08-25 13:25"),
    },
    {
      id: 43,
      temperature: 24.8,
      humidity: 53,
      light: 750,
      time: new Date("2024-08-25 13:30"),
    },
    {
      id: 44,
      temperature: 24.5,
      humidity: 55,
      light: 760,
      time: new Date("2024-08-25 13:35"),
    },
    {
      id: 45,
      temperature: 24.4,
      humidity: 51,
      light: 770,
      time: new Date("2024-08-25 13:40"),
    },
    {
      id: 46,
      temperature: 24.7,
      humidity: 49,
      light: 745,
      time: new Date("2024-08-25 13:45"),
    },
    {
      id: 47,
      temperature: 24.9,
      humidity: 52,
      light: 760,
      time: new Date("2024-08-25 13:50"),
    },
    {
      id: 48,
      temperature: 24.6,
      humidity: 50,
      light: 755,
      time: new Date("2024-08-25 13:55"),
    },
    {
      id: 49,
      temperature: 24.8,
      humidity: 54,
      light: 770,
      time: new Date("2024-08-25 14:00"),
    },
    {
      id: 50,
      temperature: 24.4,
      humidity: 52,
      light: 740,
      time: new Date("2024-08-25 14:05"),
    },
    {
      id: 51,
      temperature: 24.7,
      humidity: 51,
      light: 765,
      time: new Date("2024-08-25 14:10"),
    },
    {
      id: 52,
      temperature: 24.5,
      humidity: 50,
      light: 750,
      time: new Date("2024-08-25 14:15"),
    },
    {
      id: 53,
      temperature: 24.8,
      humidity: 53,
      light: 760,
      time: new Date("2024-08-25 14:20"),
    },
    {
      id: 54,
      temperature: 24.6,
      humidity: 49,
      light: 740,
      time: new Date("2024-08-25 14:25"),
    },
    {
      id: 55,
      temperature: 24.7,
      humidity: 55,
      light: 755,
      time: new Date("2024-08-25 14:30"),
    },
    {
      id: 56,
      temperature: 24.9,
      humidity: 52,
      light: 770,
      time: new Date("2024-08-25 14:35"),
    },
    {
      id: 57,
      temperature: 24.4,
      humidity: 48,
      light: 740,
      time: new Date("2024-08-25 14:40"),
    },
    {
      id: 58,
      temperature: 24.6,
      humidity: 51,
      light: 765,
      time: new Date("2024-08-25 14:45"),
    },
    {
      id: 59,
      temperature: 24.5,
      humidity: 50,
      light: 760,
      time: new Date("2024-08-25 14:50"),
    },
    {
      id: 60,
      temperature: 24.8,
      humidity: 53,
      light: 740,
      time: new Date("2024-08-25 14:55"),
    },
    {
      id: 61,
      temperature: 24.7,
      humidity: 49,
      light: 755,
      time: new Date("2024-08-25 15:00"),
    },
    {
      id: 62,
      temperature: 24.9,
      humidity: 52,
      light: 770,
      time: new Date("2024-08-25 15:05"),
    },
    {
      id: 63,
      temperature: 24.5,
      humidity: 55,
      light: 740,
      time: new Date("2024-08-25 15:10"),
    },
    {
      id: 64,
      temperature: 24.4,
      humidity: 51,
      light: 760,
      time: new Date("2024-08-25 15:15"),
    },
    {
      id: 65,
      temperature: 24.7,
      humidity: 50,
      light: 765,
      time: new Date("2024-08-25 15:20"),
    },
    {
      id: 66,
      temperature: 24.8,
      humidity: 53,
      light: 740,
      time: new Date("2024-08-25 15:25"),
    },
    {
      id: 67,
      temperature: 24.6,
      humidity: 49,
      light: 755,
      time: new Date("2024-08-25 15:30"),
    },
    {
      id: 68,
      temperature: 24.9,
      humidity: 52,
      light: 770,
      time: new Date("2024-08-25 15:35"),
    },
    {
      id: 69,
      temperature: 24.5,
      humidity: 50,
      light: 740,
      time: new Date("2024-08-25 15:40"),
    },
    {
      id: 70,
      temperature: 24.7,
      humidity: 51,
      light: 765,
      time: new Date("2024-08-25 15:45"),
    },
    {
      id: 71,
      temperature: 24.6,
      humidity: 53,
      light: 750,
      time: new Date("2024-08-25 15:50"),
    },
    {
      id: 72,
      temperature: 24.8,
      humidity: 49,
      light: 760,
      time: new Date("2024-08-25 15:55"),
    },
    {
      id: 73,
      temperature: 24.4,
      humidity: 52,
      light: 740,
      time: new Date("2024-08-25 16:00"),
    },
    {
      id: 74,
      temperature: 24.7,
      humidity: 50,
      light: 765,
      time: new Date("2024-08-25 16:05"),
    },
    {
      id: 75,
      temperature: 24.5,
      humidity: 51,
      light: 755,
      time: new Date("2024-08-25 16:10"),
    },
    {
      id: 76,
      temperature: 24.8,
      humidity: 53,
      light: 740,
      time: new Date("2024-08-25 16:15"),
    },
    {
      id: 77,
      temperature: 24.6,
      humidity: 49,
      light: 770,
      time: new Date("2024-08-25 16:20"),
    },
    {
      id: 78,
      temperature: 24.9,
      humidity: 52,
      light: 740,
      time: new Date("2024-08-25 16:25"),
    },
    {
      id: 79,
      temperature: 24.5,
      humidity: 55,
      light: 755,
      time: new Date("2024-08-25 16:30"),
    },
    {
      id: 80,
      temperature: 24.7,
      humidity: 50,
      light: 760,
      time: new Date("2024-08-25 16:35"),
    },
    {
      id: 81,
      temperature: 24.4,
      humidity: 52,
      light: 765,
      time: new Date("2024-08-25 16:40"),
    },
    {
      id: 82,
      temperature: 24.8,
      humidity: 49,
      light: 740,
      time: new Date("2024-08-25 16:45"),
    },
    {
      id: 83,
      temperature: 24.7,
      humidity: 51,
      light: 755,
      time: new Date("2024-08-25 16:50"),
    },
    {
      id: 84,
      temperature: 24.6,
      humidity: 53,
      light: 770,
      time: new Date("2024-08-25 16:55"),
    },
    {
      id: 85,
      temperature: 24.9,
      humidity: 50,
      light: 740,
      time: new Date("2024-08-25 17:00"),
    },
    {
      id: 86,
      temperature: 24.4,
      humidity: 52,
      light: 765,
      time: new Date("2024-08-25 17:05"),
    },
    {
      id: 87,
      temperature: 24.6,
      humidity: 49,
      light: 750,
      time: new Date("2024-08-25 17:10"),
    },
    {
      id: 88,
      temperature: 24.5,
      humidity: 53,
      light: 760,
      time: new Date("2024-08-25 17:15"),
    },
    {
      id: 89,
      temperature: 24.8,
      humidity: 50,
      light: 740,
      time: new Date("2024-08-25 17:20"),
    },
    {
      id: 90,
      temperature: 24.7,
      humidity: 51,
      light: 765,
      time: new Date("2024-08-25 17:25"),
    },
    {
      id: 91,
      temperature: 24.6,
      humidity: 49,
      light: 755,
      time: new Date("2024-08-25 17:30"),
    },
    {
      id: 92,
      temperature: 24.9,
      humidity: 52,
      light: 770,
      time: new Date("2024-08-25 17:35"),
    },
    {
      id: 93,
      temperature: 24.4,
      humidity: 50,
      light: 740,
      time: new Date("2024-08-25 17:40"),
    },
    {
      id: 94,
      temperature: 24.8,
      humidity: 53,
      light: 755,
      time: new Date("2024-08-25 17:45"),
    },
    {
      id: 95,
      temperature: 24.7,
      humidity: 51,
      light: 770,
      time: new Date("2024-08-25 17:50"),
    },
    {
      id: 96,
      temperature: 24.5,
      humidity: 52,
      light: 740,
      time: new Date("2024-08-25 17:55"),
    },
    {
      id: 97,
      temperature: 24.6,
      humidity: 49,
      light: 765,
      time: new Date("2024-08-25 18:00"),
    },
    {
      id: 98,
      temperature: 24.8,
      humidity: 50,
      light: 750,
      time: new Date("2024-08-25 18:05"),
    },
    {
      id: 99,
      temperature: 24.7,
      humidity: 53,
      light: 740,
      time: new Date("2024-08-25 18:10"),
    },
    {
      id: 100,
      temperature: 24.4,
      humidity: 52,
      light: 755,
      time: new Date("2024-08-25 18:15"),
    },
    {
      id: 101,
      temperature: 24.6,
      humidity: 51,
      light: 765,
      time: new Date("2024-08-25 18:20"),
    },
  ]);

  return <DataSensorTable data={data} />;
};

export default DataSensor;
