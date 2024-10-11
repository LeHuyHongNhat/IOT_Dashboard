import React from "react";
import "./Profile.css"; // Import file CSS
import lhhn from "./img/addln.jpg"; // Import ảnh đại diện
// Import các icon từ react-icons
import {
  FaGithub,
  FaFilePdf,
  FaBook,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Phần header của profile */}
        <div className="profile-header">
          <img src={lhhn} alt="Profile" className="profile-image" />
          <h1 className="profile-name">Le Huy Hong Nhat</h1>
          <p className="profile-title">Student at PTIT</p>
        </div>
        {/* Phần body của profile */}
        <div className="profile-body">
          {/* Thông tin mã sinh viên */}
          <p className="profile-info">
            <strong>MSV:</strong> B21DCCN575_D21HTTT06
          </p>
          {/* Thông tin email */}
          <p className="profile-info">
            <FaEnvelope className="icon" />
            <a href="mailto:NhatLHH.B21CN575@stu.ptit.edu.vn">
              NhatLHH.B21CN575@stu.ptit.edu.vn
            </a>
          </p>
          {/* Thông tin số điện thoại */}
          <p className="profile-info">
            <FaPhone className="icon" />
            <a href="tel:0949794366">0949794366</a>
          </p>
          {/* Liên kết đến GitHub */}
          <p className="profile-info">
            <FaGithub className="icon" />
            <a
              href="https://github.com/LeHuyHongNhat"
              target="_blank"
              rel="noopener noreferrer"
            >
              Le Huy Hong Nhat
            </a>
          </p>
          {/* Liên kết để tải PDF (chưa có) */}
          <p className="profile-info">
            <FaFilePdf className="icon" />
            <a href="pdf_tam_chua_co" target="_blank" rel="noopener noreferrer">
              Download PDF
            </a>
          </p>
          {/* Liên kết đến tài liệu API */}
          <p className="profile-info">
            <FaBook className="icon" />
            <a
              href="https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              API Documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
