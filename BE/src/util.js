const { TIME_ZONE } = require("./constant"); // Import hằng số TIME_ZONE từ module constant

// Hàm chuyển đổi thời gian UTC sang giờ Việt Nam
const convertUtcToVnTime = (date) => {
    return date.toLocaleString("vi-VN", {
        timeZone: TIME_ZONE, // Sử dụng múi giờ Việt Nam
    });
}

// Xuất hàm để sử dụng ở nơi khác
module.exports = {
    convertUtcToVnTime
}
