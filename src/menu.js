import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import "./menu.css"

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="menu-container">
      <button onClick={toggleMenu} className="iconmenu bi bi-list"></button>
      {menuOpen && (
        <div className="menu">
          <div className="menu-header">
            <button className="iconexit bi bi-x" onClick={closeMenu}>
            </button>
            <ul>

              <Link to="/" className="linkmenu" >
                <button className='ulLink bi bi-house-door-fill'> Home </button>
              </Link>
              <Link to="/Myprofile" className="linkmenu" >
                <button className='ulLink bi bi-person-circle'> My Profile
                </button>
              </Link>
              <Link to="/DataSensor" className="linkmenu" >
                <button className='ulLink bi bi-database'> Dữ liệu cảm biến
                </button>
              </Link>
              <Link to="/DataLedFan" className="linkmenu" >
                <button className='ulLink bi bi-clock-history'> Lịch sử bật tắt
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
