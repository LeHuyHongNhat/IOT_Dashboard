# IoT Dashboard

![IoT Dashboard Logo](link_to_logo_image)

## Giới thiệu

IoT Dashboard là một dự án toàn diện cho phép giám sát và điều khiển các thiết bị IoT thông qua một giao diện web trực quan. Dự án bao gồm ba phần chính: Backend, Frontend và mã nguồn cho thiết bị ESP32.

### Tác giả

Lê Huy Hồng Nhật

## Mục lục

- [Tính năng](#tính-năng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [API Documentation](#api-documentation)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## Tính năng

- Hiển thị dữ liệu cảm biến theo thời gian thực
- Điều khiển thiết bị IoT từ xa
- Giao diện người dùng thân thiện và responsive
- Xác thực và phân quyền người dùng
- Lưu trữ và phân tích dữ liệu lịch sử

## Cấu trúc dự án

Dự án được chia thành ba phần chính:

1. **Backend (BE)**: Xử lý dữ liệu, API, và kết nối với cơ sở dữ liệu
2. **Frontend (FE)**: Giao diện người dùng web
3. **ESP32**: Mã nguồn cho thiết bị IoT

## Công nghệ sử dụng

### Backend

- Node.js với Express.js
- Prisma ORM
- MQTT để kết nối với thiết bị IoT
- WebSocket và Socket.io cho kết nối realtime
- JWT cho xác thực

### Frontend

- React.js
- Chart.js để hiển thị biểu đồ
- Axios cho gọi API

### ESP32

- Arduino IDE
- Thư viện WiFi và MQTT cho ESP32

## Cài đặt

### Backend

1. Di chuyển vào thư mục BE:
   ```
   cd BE
   ```
2. Cài đặt dependencies:
   ```
   npm install
   ```
3. Tạo file `.env` và cấu hình các biến môi trường (xem `.env.example`)
4. Chạy migrations để cập nhật cơ sở dữ liệu:
   ```
   npx prisma migrate dev
   ```
5. Khởi động server:
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
3. Khởi động ứng dụng:
   ```
   npm start
   ```

### ESP32

1. Mở project trong Arduino IDE
2. Cài đặt các thư viện cần thiết
3. Cấu hình thông tin WiFi và MQTT broker trong mã nguồn
4. Compile và upload mã nguồn lên thiết bị ESP32

## Sử dụng

1. Truy cập dashboard thông qua trình duyệt web tại `http://localhost:3000`
2. Đăng nhập với tài khoản được cung cấp
3. Xem dữ liệu cảm biến và điều khiển thiết bị từ giao diện dashboard

## API Documentation

Chi tiết về các API có sẵn và cách sử dụng chúng có thể được tìm thấy trong [API Documentation](link_to_api_doc).

## Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp cho dự án. Nếu bạn muốn đóng góp, vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit các thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## Giấy phép

Dự án này được phân phối dưới giấy phép [MIT](LICENSE).

---

© 2024 Lê Huy Hồng Nhật. Bảo lưu mọi quyền.
