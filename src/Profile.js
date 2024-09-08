import React from "react";
import "./Profile.css"; // Import the CSS file
import lhhn from "./img/addln.jpg";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={lhhn} alt="Profile" className="profile-image" />
        <p className="profile-info">
          <strong>MSV:</strong> B21DCCN575_D21HTTT06
        </p>
        <p className="profile-info">
          <strong>Full Name:</strong> Le Huy Hong Nhat
        </p>
        <p className="profile-info">
          <strong>Email:</strong> NhatLHH.B21CN575@stu.ptit.edu.vn
        </p>
        <p className="profile-info">
          <strong>Phone:</strong> 0949794366
        </p>
        <p className="profile-info">
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/LeHuyHongNhat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Le Huy Hong Nhat
          </a>
        </p>
        <p className="profile-info">
          <strong>PDF:</strong>{" "}
          <a href="pdf_tam_chua_co" target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </p>
        <p className="profile-info">
          <strong>Swagger, Postman, API Docs:</strong>{" "}
          <a
            href="api_doc_tam_chua_co"
            target="_blank"
            rel="noopener noreferrer"
          >
            API Documentation
          </a>
        </p>
      </div>
    </div>
  );
};

export default Profile;
