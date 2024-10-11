// Import các hàm cần thiết từ thư viện testing
import { render, screen } from "@testing-library/react";
// Import component App để test
import App from "./App";

// Định nghĩa một test case
test("renders learn react link", () => {
  // Render component App
  render(<App />);

  // Tìm kiếm một phần tử có text là "learn react" (không phân biệt chữ hoa/thường)
  const linkElement = screen.getByText(/learn react/i);

  // Kiểm tra xem phần tử có tồn tại trong document không
  expect(linkElement).toBeInTheDocument();
});
