import axios from "axios";

// Tạo một instance của axios với cấu hình tùy chỉnh
const axiosClient = axios.create({
  // Đặt URL cơ sở cho tất cả các request
  baseURL: "http://localhost:3001",
  // Đặt headers mặc định cho tất cả các request
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor cho response
axiosClient.interceptors.response.use(
  // Hàm xử lý khi response thành công
  (response) => response?.data ?? response,
  // Hàm xử lý khi response bị lỗi
  (error) => Promise.reject(error)
);

// Export instance axios đã được cấu hình
export default axiosClient;
