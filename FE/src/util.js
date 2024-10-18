// Hàm tạo chuỗi query từ các đối tượng filter và page
export const createQueryString = (filter, page) => {
  let queryString = "?";
  // Thêm các tham số từ đối tượng filter vào chuỗi query
  Object.keys(filter).forEach((query) => {
    if (filter[query]) queryString += `${query}=${filter[query]}&`;
  });
  // Thêm các tham số từ đối tượng page vào chuỗi query
  Object.keys(page).forEach((query) => {
    if (page[query]) queryString += `${query}=${page[query]}&`;
  });
  // Loại bỏ dấu '&' cuối cùng
  return queryString.slice(0, -1);
};

// Hàm chuyển đổi dữ liệu cảm biến
export const mappingDataSensor = (datas) => {
  return datas.map((data) => {
    return {
      id: data.id,
      temperature: data.temperature,
      humidity: data.humidity,
      light: data.light,
      time: convertUtcToVnTime(data.createdAt), // Chuyển đổi thời gian UTC sang giờ Việt Nam
    };
  });
};

// Hàm chuyển đổi dữ liệu lịch sử hành động
export const mappingActionHistory = (datas) => {
  return datas.map((data) => {
    return {
      id: data.id,
      device: data.device,
      action: data.action,
      time: convertUtcToVnTime(data.createdAt), // Chuyển đổi thời gian UTC sang giờ Việt Nam
    };
  });
};

// Hàm chuyển đổi thời gian UTC sang định dạng giờ Việt Nam
export const convertUtcToVnTime = (time) => {
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

export const convertUtcToVnTimeChart = (time) => {
  const date = new Date(time);
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(date)
}