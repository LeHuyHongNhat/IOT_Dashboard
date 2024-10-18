const { TIME_ZONE } = require("./constant");

const convertUtcToVnTime = (time) => {
    const date = new Date(time);

    // Chuyển đổi giờ UTC về múi giờ Việt Nam
    const vnTime = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));

    const year = vnTime.getFullYear();
    const month = String(vnTime.getMonth() + 1).padStart(2, '0'); // getMonth() trả về giá trị từ 0 đến 11
    const day = String(vnTime.getDate()).padStart(2, '0');
    const hours = String(vnTime.getHours()).padStart(2, '0');
    const minutes = String(vnTime.getMinutes()).padStart(2, '0');
    const seconds = String(vnTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {
    convertUtcToVnTime
}



