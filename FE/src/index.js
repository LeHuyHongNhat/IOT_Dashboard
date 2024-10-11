// Import các dependencies cần thiết
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Tạo root cho ứng dụng React
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render ứng dụng React
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Ghi chú về việc đo lường hiệu suất
// Nếu bạn muốn bắt đầu đo lường hiệu suất trong ứng dụng của mình, hãy truyền một hàm
// để ghi log kết quả (ví dụ: reportWebVitals(console.log))
// hoặc gửi đến một endpoint phân tích. Tìm hiểu thêm tại: https://bit.ly/CRA-vitals
reportWebVitals();
