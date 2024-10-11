// Import các dependencies cần thiết
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./menu.css";

// Định nghĩa component Menu
const Menu = () => {
  // State để kiểm soát trạng thái mở/đóng của menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Hàm để chuyển đổi trạng thái mở/đóng của menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Hàm để đóng menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="menu-container">
      {/* Nút để mở/đóng menu */}
      <button onClick={toggleMenu} className="iconmenu bi bi-list"></button>
      {/* Hiển thị menu khi menuOpen là true */}
      {menuOpen && (
        <div className="menu">
          <div className="menu-header">
            {/* Nút để đóng menu */}
            <button className="iconexit bi bi-x" onClick={closeMenu}></button>
            <ul>
              {/* Các liên kết trong menu */}
              <Link to="/" className="linkmenu">
                <button className="ulLink bi bi-house-door-fill"> Home </button>
              </Link>
              <Link to="/Myprofile" className="linkmenu">
                <button className="ulLink bi bi-person-circle">
                  {" "}
                  My Profile
                </button>
              </Link>
              <Link to="/DataSensor" className="linkmenu">
                <button className="ulLink bi bi-database">
                  {" "}
                  Dữ liệu cảm biến
                </button>
              </Link>
              <Link to="/DataLedFan" className="linkmenu">
                <button className="ulLink bi bi-clock-history">
                  {" "}
                  Lịch sử bật tắt
                </button>
              </Link>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
