import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

interface ParamType {
  params: {
    id: string;
  };
}
/// lấy thông tin theo id.
export async function GET(request: Request, { params }: ParamType) {
  const { id } = params;

  // Đường dẫn
  const filePath = path.join(process.cwd(), "src/app/dataBase/user.json");

  try {
    // Đọc dữ liệu
    const data = fs.readFileSync(filePath, "utf8");
    const employees = JSON.parse(data);

    // Tìm nhân viên theo id
    const employee = employees.find(
      (e: { id: number }) => e.id === parseInt(id, 10) //chuyển sang cơ số 10
    );

    //nếu không thấy
    if (!employee) {
      return NextResponse.json({ message: "Nhân viên không tồn tại" });
    }

    // Trả về thông tin nhân viên
    return NextResponse.json({ data: employee });
  } catch (error) {
    return NextResponse.json({ message: "Lấy dữ liệu thất bại" });
  }
}

/// cập nhật thông tin theo id
export async function PUT(request: Request, { params }: ParamType) {
  const { id } = params;
  const { employeeName, dateOfBirth, employeeImage, email } =
    await request.json();

  // validate
  if (!employeeName && !dateOfBirth && !employeeImage && !email) {
    return NextResponse.json({ message: "Thiếu thông tin để cập nhật" });
  }

  // Đường dẫn
  const filePath = path.join(process.cwd(), "src/app/dataBase/user.json");

  try {
    // Đọc dữ liệu
    const data = fs.readFileSync(filePath, "utf8");
    const employees = JSON.parse(data);

    // Tìm nhân viên theo id
    const employeeIndex = employees.findIndex(
      (emp: { id: number }) => emp.id === parseInt(id, 10)
    );
    if (employeeIndex === -1) {
      return NextResponse.json({ message: "Nhân viên không tồn tại" });
    }

    // Cập nhật thông tin nhân viên
    if (employeeName) employees[employeeIndex].employeeName = employeeName;
    if (dateOfBirth) employees[employeeIndex].dateOfBirth = dateOfBirth;
    if (employeeImage) employees[employeeIndex].employeeImage = employeeImage;
    if (email) employees[employeeIndex].email = email;

    // Ghi lại mảng nhân viên
    fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));

    // Trả về
    return NextResponse.json({
      message: "Cập nhật thông tin nhân viên thành công",
      data: employees[employeeIndex],
    });
  } catch (error) {
    return NextResponse.json({ message: "Xử lí dữ liệu thất bại" });
  }
}

/// xóa nhân viên theo id
export async function DELETE(request: Request, { params }: ParamType) {
  const { id } = params;

  // Kiểm tra xem id có được cung cấp hay không
  if (!id) {
    return NextResponse.json({ message: "Thiếu id nhân viên" });
  }

  // Đường dẫn tới file employees.json
  const filePath = path.join(process.cwd(), "src/app/dataBase/user.json");

  try {
    // Đọc dữ liệu
    const data = fs.readFileSync(filePath, "utf8");
    const employees = JSON.parse(data);

    // Tìm nhân viên theo id
    const employeeIndex = employees.findIndex(
      (emp: { id: number }) => emp.id === parseInt(id, 10)
    );
    //nếu không thấy
    if (employeeIndex === -1) {
      return NextResponse.json({ message: "Nhân viên không tồn tại" });
    }

    // Xóa nhân viên khỏi mảng
    const deletedEmployee = employees.splice(employeeIndex, 1);

    // Ghi lại mảng nhân viên
    fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));

    // Trả về danh sách nhân viên mới sau khi đã xóa
    return NextResponse.json({
      message: "Xóa nhân viên thành công",
      data: deletedEmployee,
    });
  } catch (error) {
    return NextResponse.json({ message: "Xử lí dữ liệu thất bại" });
  }
}
