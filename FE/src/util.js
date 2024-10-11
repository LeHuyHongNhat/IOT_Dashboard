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
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh", // Đặt múi giờ Việt Nam
  }).format(date);
};
