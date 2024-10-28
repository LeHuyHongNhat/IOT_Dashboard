import React, { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import DataSensor from "./DataSensor";
import ActionHistory from "./ActionHistory";
import Profile from "./Profile";
import NewPage from "./NewPage"; // Import NewPage

const App = () => {
  // State để lưu trữ trang hiện tại
  const [currentPage, setCurrentPage] = useState("Dashboard");

  // Hàm để render component tương ứng với trang hiện tại
  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;
      case "DataSensor":
        return <DataSensor />;
      case "ActionHistory":
        return <ActionHistory />;
      case "Profile":
        return <Profile />;
      case "NewPage": // Thêm trường hợp cho NewPage
        return <NewPage />;
      default:
        return <Dashboard />; // Mặc định hiển thị Dashboard
    }
  };

  return (
    <div>
      {/* Thanh điều hướng */}
      <nav>
        <button onClick={() => setCurrentPage("Dashboard")}>Dashboard</button>
        <button onClick={() => setCurrentPage("DataSensor")}>
          Data Sensor
        </button>
        <button onClick={() => setCurrentPage("ActionHistory")}>
          Action History
        </button>
        <button onClick={() => setCurrentPage("Profile")}>Profile</button>
        <button onClick={() => setCurrentPage("NewPage")}>New Page</button>{" "}
        {/* Thêm nút cho NewPage */}
      </nav>
      {/* Phần nội dung chính */}
      <div className="page-content">{renderPage()}</div>
    </div>
  );
};

export default App;
