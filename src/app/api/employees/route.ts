import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/// lấy tất cả.
export async function GET() {
  // Đường dẫn
  const filePath = path.join(process.cwd(), "src/app/dataBase/user.json");

  // Đọc dữ liệu từ file
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const employees = JSON.parse(data);
    console.log(111, employees);

    // Trả về dữ liệu dưới dạng JSON
    return NextResponse.json({ data: employees });
  } catch (error) {
    return NextResponse.json({ message: "Lấy dữ liệu thất bại.", error });
  }
}

/// thêm mới
export async function POST(request: Request) {
  // Lấy dữ liệu nhân viên mới từ người dùng
  const { id, employeeName, dateOfBirth, employeeImage, email } =
    await request.json();

  // validate trống
  if (!employeeName || !dateOfBirth || !employeeImage || !email) {
    return NextResponse.json({ message: "Thiếu thông tin nhân viên" });
  }

  // Đường dẫn
  const filePath = path.join(process.cwd(), "src/app/dataBase/user.json");

  try {
    // Đọc dữ liệu
    const data = fs.readFileSync(filePath, "utf8");
    const employees = JSON.parse(data);

    // validate tồn tại
    const existingEmployee = employees.find(
      (emp: { email: string }) => emp.email === email
    );
    if (existingEmployee) {
      return NextResponse.json({ message: "nhân viên đã tồn tại" });
    }

    // Thêm nhân viên mới vào mảng
    const newEmployee = { id, employeeName, dateOfBirth, employeeImage, email };
    employees.push(newEmployee);

    // Ghi lại mảng nhân viên
    fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));

    // Trả về
    return NextResponse.json({
      message: "Thêm mới nhân viên thành công",
      data: newEmployee,
    });
  } catch (error) {
    return NextResponse.json({ message: "Xử lí dữ liệu thất bài" });
  }
}
