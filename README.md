# IoT Dashboard

![IoT Dashboard Logo](FE/public/IoT-1.jpg)

## Giới thiệu

IoT Dashboard là một dự án toàn diện cho phép giám sát và điều khiển các thiết bị IoT thông qua một giao diện web trực quan. Dự án bao gồm ba phần chính: Backend, Frontend và mã nguồn cho thiết bị ESP32. Hệ thống này cung cấp một giải pháp end-to-end cho việc quản lý và tương tác với các thiết bị IoT trong môi trường thông minh.

### Tác giả

Lê Huy Hồng Nhật - Sinh viên tại Học viện Công nghệ Bưu chính Viễn thông (PTIT)

## Mục lục

- [Tính năng](#tính-năng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [API Documentation](#api-documentation)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)
- [Liên hệ](#liên-hệ)

## Tính năng

- **Hiển thị dữ liệu cảm biến theo thời gian thực**: Cập nhật liên tục các chỉ số như nhiệt độ, độ ẩm, ánh sáng từ các thiết bị IoT.
- **Điều khiển thiết bị IoT từ xa**: Bật/tắt các thiết bị thông qua dashboard.
- **Giao diện người dùng thân thiện và responsive**: Thiết kế tương thích với nhiều kích thước màn hình.
- **Xác thực và phân quyền người dùng**: Hệ thống đăng nhập an toàn và quản lý quyền truy cập.
- **Lưu trữ và phân tích dữ liệu lịch sử**: Khả năng xem lại và phân tích dữ liệu theo thời gian.
- **Cảnh báo và thông báo**: Gửi thông báo khi các chỉ số vượt ngưỡng định sẵn.

## Cấu trúc dự án

Dự án được chia thành ba phần chính:

1. **Backend (BE)**:

   - Xử lý dữ liệu và cung cấp API RESTful
   - Quản lý kết nối với cơ sở dữ liệu
   - Xử lý logic nghiệp vụ và xác thực
   - Kết nối với thiết bị IoT thông qua MQTT

2. **Frontend (FE)**:

   - Giao diện người dùng web sử dụng React
   - Hiển thị dữ liệu dưới dạng biểu đồ và bảng
   - Cung cấp các điều khiển để tương tác với thiết bị IoT

3. **ESP32**:
   - Mã nguồn cho thiết bị IoT
   - Đọc dữ liệu từ cảm biến và gửi lên server
   - Nhận lệnh điều khiển từ server và thực thi

## Công nghệ sử dụng

### Backend

- **Node.js** với **Express.js**: Nền tảng phát triển server-side
- **Prisma ORM**: ORM hiện đại cho Node.js và TypeScript
- **MQTT**: Giao thức nhẹ để kết nối với thiết bị IoT
- **WebSocket** và **Socket.io**: Cho kết nối realtime giữa server và client
- **JWT (JSON Web Tokens)**: Xác thực và bảo mật API
- **MySQL**: Hệ quản trị cơ sở dữ liệu quan hệ

### Frontend

- **React.js**: Thư viện JavaScript để xây dựng giao diện người dùng
- **Chart.js**: Thư viện tạo biểu đồ tương tác
- **Axios**: Thư viện HTTP client dựa trên Promise
- **React Router**: Quản lý định tuyến trong ứng dụng React
- **Bootstrap**: Framework CSS cho thiết kế responsive

### ESP32

- **Arduino IDE**: Môi trường phát triển tích hợp cho ESP32
- **Thư viện WiFi**: Kết nối ESP32 với mạng WiFi
- **Thư viện MQTT**: Giao tiếp với MQTT broker
- **Thư viện cảm biến**: Đọc dữ liệu từ các cảm biến (ví dụ: DHT11, LDR)

## Cài đặt

### Yêu cầu hệ thống

- Node.js (v14.0.0 trở lên)
- npm (v6.0.0 trở lên)
- MySQL (v8.0 trở lên)
- Arduino IDE (v1.8.0 trở lên)

### Backend

1. Di chuyển vào thư mục BE:
   ```
   cd BE
   ```
2. Cài đặt dependencies:
   ```
   npm install
   ```
3. Tạo file `.env` và cấu hình các biến môi trường (xem `.env.example`):
   ```
   cp .env.example .env
   ```
4. Chỉnh sửa file `.env` với thông tin cấu hình của bạn
5. Chạy migrations để cập nhật cơ sở dữ liệu:
   ```
   npx prisma migrate dev
   ```
6. Khởi động server:
   ```
   npm start
   ```

### Frontend

1. Di chuyển vào thư mục FE:
   ```
   cd FE
   ```
2. Cài đặt dependencies:
   ```
   npm install
   ```
3. Tạo file `.env.local` và cấu hình các biến môi trường:
   ```
   cp .env.example .env.local
   ```
4. Chỉnh sửa file `.env.local` với thông tin cấu hình của bạn
5. Khởi động ứng dụng:
   ```
   npm start
   ```

### ESP32

1. Mở project trong Arduino IDE
2. Cài đặt các thư viện cần thiết thông qua Library Manager:
   - WiFi
   - PubSubClient (cho MQTT)
   - ArduinoJson
   - DHT sensor library (nếu sử dụng cảm biến DHT)
3. Cấu hình thông tin WiFi và MQTT broker trong mã nguồn:
   ```cpp
   const char* ssid = "Your_WiFi_SSID";
   const char* password = "Your_WiFi_Password";
   const char* mqtt_server = "Your_MQTT_Broker_Address";
   ```
4. Compile và upload mã nguồn lên thiết bị ESP32

## Sử dụng

1. Truy cập dashboard thông qua trình duyệt web tại `http://localhost:3000`
2. Xem dữ liệu cảm biến và điều khiển thiết bị từ giao diện dashboard
3. Sử dụng các tính năng như:
   - Xem biểu đồ dữ liệu theo thời gian thực
   - Điều khiển thiết bị
   - Xem lịch sử dữ liệu
   - Xem thông tin cá nhân

## API Documentation

Chi tiết về các API có sẵn và cách sử dụng chúng có thể được tìm thấy trong [API Documentation](https://schema.getpostman.com/json/collection/v2.1.0/collection.json).

Các endpoint chính bao gồm:

- `/api/auth`: Xác thực người dùng
- `/api/devices`: Quản lý thiết bị
- `/api/data`: Truy xuất dữ liệu cảm biến
- `/api/control`: Điều khiển thiết bị

## Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp cho dự án. Nếu bạn muốn đóng góp, vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit các thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

Vui lòng đảm bảo cập nhật tests khi thích hợp và tuân thủ coding style của dự án.

## Giấy phép

Dự án này được phân phối dưới giấy phép [MIT](LICENSE). Xem file `LICENSE` để biết thêm chi tiết.

## Liên hệ

Lê Huy Hồng Nhật - [@LeHuyHongNhat](https://github.com/LeHuyHongNhat) - NhatLHH.B21CN575@stu.ptit.edu.vn

Link dự án: [https://github.com/LeHuyHongNhat/IoT-Dashboard](https://github.com/LeHuyHongNhat/IoT-Dashboard)

---

© 2024 Lê Huy Hồng Nhật. Bảo lưu mọi quyền.
