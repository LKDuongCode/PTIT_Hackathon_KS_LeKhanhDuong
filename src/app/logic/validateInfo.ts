// Hàm kiểm tra tính hợp lệ của dữ liệu
export default function validateEmpty(employee: {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  employeeImage: string;
  email: string;
}) {
  // Kiểm tra không để trống
  if (
    employee.dateOfBirth === "" ||
    employee.email === "" ||
    employee.employeeImage === "" ||
    employee.employeeName === ""
  ) {
    return true;
  }
}

export function validateEmail(email: string): boolean {
  // Định dạng email hợp lệ
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return true;
  }
  return false;
}

export function validateDate(dateOfBirth: string): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  if (birthDate > today) {
    return true;
  }
  return false;
}
