// Định nghĩa hàm reportWebVitals để đo lường hiệu suất web
const reportWebVitals = onPerfEntry => {
  // Kiểm tra xem onPerfEntry có tồn tại và là một hàm không
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Import động các hàm từ thư viện 'web-vitals'
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Đo lường Cumulative Layout Shift (CLS)
      getCLS(onPerfEntry);
      // Đo lường First Input Delay (FID)
      getFID(onPerfEntry);
      // Đo lường First Contentful Paint (FCP)
      getFCP(onPerfEntry);
      // Đo lường Largest Contentful Paint (LCP)
      getLCP(onPerfEntry);
      // Đo lường Time to First Byte (TTFB)
      getTTFB(onPerfEntry);
    });
  }
};

// Export hàm reportWebVitals để sử dụng ở nơi khác trong ứng dụng
export default reportWebVitals;
