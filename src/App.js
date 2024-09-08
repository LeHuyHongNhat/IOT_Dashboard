import React, { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import DataSensor from "./DataSensor";
import ActionHistory from "./ActionHistory";
import Profile from "./Profile";

// App.use("/local-files", express.static("/"));
const App = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage("Dashboard")}>Dashboard</button>
        <button onClick={() => setCurrentPage("DataSensor")}>
          Data Sensor
        </button>
        <button onClick={() => setCurrentPage("ActionHistory")}>
          Action History
        </button>
        <button onClick={() => setCurrentPage("Profile")}>Profile</button>
      </nav>
      <div className="page-content">{renderPage()}</div>
    </div>
  );
};

export default App;
