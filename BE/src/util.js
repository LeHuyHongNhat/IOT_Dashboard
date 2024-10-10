const { TIME_ZONE } = require("./constant");

const convertUtcToVnTime = (date) => {
    return date.toLocaleString("vi-VN", {
        timeZone: TIME_ZONE,
    });
}

module.exports = {
    convertUtcToVnTime
}