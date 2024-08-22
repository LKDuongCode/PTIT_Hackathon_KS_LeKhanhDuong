"use client";
import axios from "axios";
import { Clicker_Script } from "next/font/google";
import React, { useEffect, useState } from "react";
import validateEmpty, {
  validateDate,
  validateEmail,
} from "./logic/validateInfo";
interface Employee {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  employeeImage: string;
  email: string;
}

export default function page() {
  // todo : render nhân viên-------------------------------------------------------------------
  const [getData, setGetData] = useState<any>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Gọi API để lấy danh sách nhân viên khi component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        if (!response.ok) {
          throw new Error("Lỗi khi tải danh sách nhân viên");
        }
        const data = await response.json();
        setGetData(data);
      } catch (error) {
        console.error("Không thể tải danh sách nhân viên", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    setEmployees(getData.data);
  }, [getData]);
  // todo : render nhân viên-------------------------------------------------------------------

  // todo : validate
  const [checkValidate, setCheckValidate] = useState<any>({
    empty: false,
    emailCheck: false,
    dayCheck: false,
  });

  //todo : thêm mới nhan viên--------------------------------------------------------------------
  // state cho nhân viên mới tạm thời
  const [newEmp, setNewEmp] = useState({
    id: Math.ceil(Math.random() * 1234567890),
    employeeName: "",
    dateOfBirth: "",
    employeeImage: "",
    email: "",
  });

  /// hamd lấy dữ liệu từ người dùng
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmp({ ...newEmp, [name]: value });
  };

  ///hàm làm xóa thông tin sau khi thêm
  const deleteInput = () => {
    setNewEmp({
      id: Math.ceil(Math.random() * 1234567890),
      employeeName: "",
      dateOfBirth: "",
      employeeImage: "",
      email: "",
    });
  };

  /// hàm gọi thêm nhân viên mới
  const handleCreateNew = async () => {
    //validate
    if (validateEmpty(newEmp)) {
      setCheckValidate((prev: any) => ({
        ...prev,
        empty: true,
      }));
      return;
    } else {
      setCheckValidate((prev: any) => ({
        ...prev,
        empty: false,
      }));
    }
    if (validateDate(newEmp.dateOfBirth)) {
      setCheckValidate((prev: any) => ({
        ...prev,
        dayCheck: true,
      }));
      return;
    } else {
      setCheckValidate((prev: any) => ({
        ...prev,
        dayCheck: false,
      }));
    }
    if (validateEmail(newEmp.email)) {
      setCheckValidate((prev: any) => ({
        ...prev,
        emailCheck: true,
      }));
      return;
    } else {
      setCheckValidate((prev: any) => ({
        ...prev,
        emailCheck: false,
      }));
    }
    if (
      !checkValidate.emailCheck &&
      !checkValidate.dayCheck &&
      !checkValidate.empty
    ) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/employees",
          newEmp
        );
        // làm mới data
        deleteInput();
        try {
          const response = await fetch("/api/employees");
          if (!response.ok) {
            throw new Error("Lỗi khi tải danh sách nhân viên");
          }
          const data = await response.json();
          setGetData(data);
        } catch (error) {
          console.error("Không thể tải danh sách nhân viên", error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("sai");
      return;
    }
  };
  //todo : thêm mới nhan viên--------------------------------------------------------------------

  //todo : xóa nhân viên---------------------------------------------------
  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/employees/${id}`
        );

        if (response.status === 200) {
          console.log("xóa thành công");
          try {
            const response = await fetch("/api/employees");
            if (!response.ok) {
              throw new Error("Lỗi khi tải danh sách nhân viên");
            }
            const data = await response.json();
            setGetData(data);
          } catch (error) {
            console.error("Không thể tải danh sách nhân viên", error);
          }
        } else {
          throw new Error("Xóa nhân viên không thành công");
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
    } else {
      console.log("Xóa nhân viên bị hủy");
    }
  };
  //todo : xóa nhân viên---------------------------------------------------

  // todo : sửa nhân viên ----------------------------------------------
  const [formManage, setFormManage] = useState<boolean>(false); // state quản lí hai form thêm và sửa
  const [updateEmployee, setUpdateEmployee] = useState<any>({
    id: 0,
    employeeName: "",
    dateOfBirth: "",
    employeeImage: "",
    email: "",
  });
  const handleFindUpdate = (id: number) => {
    ///tìm nhân viên
    const empFound = employees.find((em: Employee) => {
      return +em.id === id;
    });
    if (empFound) {
      setUpdateEmployee(empFound);
      setFormManage(true);
    }
    return;
  };
  /// hamd lấy dữ liệu từ người dùng
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateEmployee({ ...updateEmployee, [name]: value });
  };

  /// hàm xác nhận sửa
  const handleUpdateEmp = async () => {
    if (confirm("Bạn có chắc muốn sửa thông tin của nhân viên này? ")) {
      setFormManage(false);
      try {
        const res = await axios.put(
          `http://localhost:3000/api/employees/${updateEmployee.id}`,
          updateEmployee
        );

        if (res.status === 200) {
          alert("Cập nhật thông tin nhân viên thành công");
          try {
            const response = await fetch("/api/employees");
            if (!response.ok) {
              throw new Error("Lỗi khi tải danh sách nhân viên");
            }
            const data = await response.json();
            setGetData(data);
          } catch (error) {
            console.error("Không thể tải danh sách nhân viên", error);
          }
        } else {
          alert("Có lỗi xảy ra khi cập nhật thông tin.");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFormManage(false);
      }
    }
    setFormManage(false);
  };

  // todo : sửa nhân viên ----------------------------------------------
  return (
    <>
      <div className="flex gap-10 w-[1400px] p-5">
        <table border={1} className=" p-5 border-solid w-[70%] h-max">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên nhân viên</th>
              <th>Ngày sinh</th>
              <th>Hình ảnh</th>
              <th>Email</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((emp: Employee, index: number) => {
              return (
                <tr key={emp.id}>
                  <td className="pl-5">{index + 1}</td>
                  <td className="pl-5">{emp.employeeName}</td>
                  <td className="pl-5">{emp.dateOfBirth}</td>
                  <td className="w-[150px] h-[100px]">
                    <img
                      src={emp.employeeImage}
                      alt=""
                      className="w-full h-full"
                    />
                  </td>
                  <td className="pl-5">{emp.email}</td>
                  <td className="text-center">
                    <div className="flex gap-5 justify-center">
                      <button
                        onClick={() => handleFindUpdate(emp.id)}
                        className="border-2 border-solid border-amber-400 rounded-md text-center p-2 text-white bg-amber-400 text-base"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="border-2 border-solid border-red-400 rounded-md text-center p-2 text-white bg-red-400 text-base"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* form sửa--------------------------------- */}
        {formManage ? (
          <div className="flex gap-5 flex-col mt-3 w-[300px] border-solid border-2 border-stone-300 p-5">
            <h2 className="bg-green-400 p-1 text-center">Sửa nhân viên</h2>
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Tên nhân viên</p>
              <input
                name="employeeName"
                onChange={handleUpdateChange}
                value={updateEmployee.employeeName}
                type="text"
                className="w-full h-8 p-3 border-2 rounded border-stone-200 border-solid"
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Ngày sinh</p>
              <input
                name="dateOfBirth"
                onChange={handleUpdateChange}
                value={updateEmployee.dateOfBirth}
                type="date"
                className="w-full h-8 p-3 border-2 rounded border-stone-200 border-solid"
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Hỉnh ảnh</p>
              <input
                name="employeeImage"
                onChange={handleUpdateChange}
                value={updateEmployee.employeeImage}
                type="text"
                className="w-full h-8 p-3 border-2 rounded border-stone-200 border-solid"
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Email</p>
              <input
                name="email"
                onChange={handleUpdateChange}
                value={updateEmployee.email}
                type="text"
                className="w-full h-8 p-3 border-2 rounded border-stone-200 border-solid"
              />
            </div>
            {/* {checkValidate.empty && (
    <p className="bg-red-200 text-red-500 p-1">Không được để trống</p>
  )}
  {checkValidate.emailCheck && (
    <p className="bg-red-200 text-red-500 p-1">Email không hợp lệ</p>
  )}
  {checkValidate.dayCheck && (
    <p className="bg-red-200 text-red-500 p-1">Ngày sinh không hợp lệ</p>
  )} */}
            <button
              className="border-2 border-solid border-green-400 rounded-md text-center p-2 text-white bg-green-400 text-base"
              onClick={handleUpdateEmp}
            >
              Sửa
            </button>
          </div>
        ) : (
          // todo : form thêm mới ---------------------------------------------------------
          <div className="border-stone-300 rounded border-2 border-solid p-5 h-max">
            <h2 className="text-center">Thêm mới nhân viên</h2>
            <div className="flex gap-5 flex-col mt-3">
              <div className="flex flex-col gap-3">
                <p className="font-semibold">Tên nhân viên</p>
                <input
                  name="employeeName"
                  onChange={handleInputChange}
                  value={newEmp.employeeName}
                  type="text"
                  className="w-full h-8 p-3 border-2 rounded border-stone-200 border-solid"
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-semibold">Ngày sinh</p>
                <input
                  name="dateOfBirth"
                  onChange={handleInputChange}
                  value={newEmp.dateOfBirth}
                  type="date"
                  className="w-full h-8 p-3 border-2 rounded border-stone-200 border-solid"
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-semibold">Hỉnh ảnh</p>
                <input
                  name="employeeImage"
                  onChange={handleInputChange}
                  value={newEmp.employeeImage}
                  type="text"
                  className="w-full h-8 p-3 border-2 rounded border-stone-200 border-solid"
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-semibold">Email</p>
                <input
                  name="email"
                  onChange={handleInputChange}
                  value={newEmp.email}
                  type="text"
                  className="w-full h-8 p-3 border-2 rounded border-stone-200 border-solid"
                />
              </div>
              {checkValidate.empty && (
                <p className="bg-red-200 text-red-500 p-1">
                  Không được để trống
                </p>
              )}
              {checkValidate.emailCheck && (
                <p className="bg-red-200 text-red-500 p-1">
                  Email không hợp lệ
                </p>
              )}
              {checkValidate.dayCheck && (
                <p className="bg-red-200 text-red-500 p-1">
                  Ngày sinh không hợp lệ
                </p>
              )}
              <button
                className="border-2 border-solid border-blue-400 rounded-md text-center p-2 text-white bg-blue-400 text-base"
                onClick={handleCreateNew}
              >
                Thêm
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
