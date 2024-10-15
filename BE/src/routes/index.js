const data = require('./dataSensor'); // Import route cho dữ liệu cảm biến
const table = require('./table'); // Import route cho bảng (giả sử là một phần khác của ứng dụng)

// Hàm để thiết lập các route cho ứng dụng
function route(app) {
    app.use('/data', data); // Sử dụng route cho dữ liệu cảm biến tại endpoint '/data'
    app.use('/table', table); // Sử dụng route cho bảng tại endpoint '/table'
    
    // Định nghĩa route gốc ('/') để trả về một thông điệp đơn giản
    app.use('/', (req, res) => {
        res.send('Hello World!');
    });
}

// Xuất hàm route để sử dụng ở nơi khác
module.exports = route;
