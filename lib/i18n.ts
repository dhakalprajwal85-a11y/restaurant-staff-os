"use client";

import { useEffect, useState } from "react";

export type Language = "en" | "ko" | "vi";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Manage workers and daily operations",

    workers: "Workers",
    schedule: "Schedule",
    attendance: "Attendance",
    payroll: "Payroll",
    tasks: "Tasks",
    settings: "Settings",
    logout: "Logout",

    qrAttendance: "QR Attendance",
    addWorker: "Add Worker",

    totalWorkers: "Total Workers",
    activeWorkers: "Active Workers",
    attendanceLogs: "Attendance Logs",
    scheduledShifts: "Scheduled Shifts",

    welcomeBack: "Welcome back, Staff",
    manageOperations: "Manage workers and daily operations",
    activeStaff: "Active Staff",
    todaySales: "Today Sales",
    reservations: "Reservations",
    entryTime: "Entry Time",
    clockIn: "Clock In",
    clockOut: "Clock Out",

    workersTitle: "Workers",
    searchWorkers: "Search workers...",

    addStoreTask: "Add Store Task",
    taskTitle: "Task title",
    taskDescription: "Task description",
    saveTask: "Save Task",

    settingsDescription: "Manage restaurant app settings",
    restaurantName: "Restaurant Name",
    currency: "Currency",
    openingTime: "Opening Time",
    closingTime: "Closing Time",
    defaultHourlyWage: "Default Hourly Wage",
    saveSettings: "Save Settings",
    settingsSaved: "Settings saved successfully",

    payrollDescription: "Calculate worker salary from attendance records",
    workerName: "Worker Name",
    totalHours: "Total Hours",
    hourlyWage: "Hourly Wage",
    estimatedSalary: "Estimated Salary",
    noPayrollData: "No completed attendance records found",
    hours: "hours",
  },

  ko: {
    dashboard: "대시보드",
    dashboardTitle: "대시보드",
    dashboardSubtitle: "직원과 일일 운영을 관리하세요",

    workers: "직원",
    schedule: "일정",
    attendance: "출근관리",
    payroll: "급여 관리",
    tasks: "업무",
    settings: "설정",
    logout: "로그아웃",

    qrAttendance: "QR 출근",
    addWorker: "직원 추가",

    totalWorkers: "전체 직원",
    activeWorkers: "근무 중 직원",
    attendanceLogs: "출근 기록",
    scheduledShifts: "예정 근무",

    welcomeBack: "다시 오신 것을 환영합니다, 직원님",
    manageOperations: "직원과 일일 운영을 관리하세요",
    activeStaff: "근무 중 직원",
    todaySales: "오늘 매출",
    reservations: "예약",
    entryTime: "출근 시간",
    clockIn: "출근",
    clockOut: "퇴근",

    workersTitle: "직원",
    searchWorkers: "직원 검색...",

    addStoreTask: "업무 추가",
    taskTitle: "업무 제목",
    taskDescription: "업무 설명",
    saveTask: "업무 저장",

    settingsDescription: "매장 앱 설정을 관리하세요",
    restaurantName: "매장 이름",
    currency: "통화",
    openingTime: "오픈 시간",
    closingTime: "마감 시간",
    defaultHourlyWage: "기본 시급",
    saveSettings: "설정 저장",
    settingsSaved: "설정이 저장되었습니다",

    payrollDescription: "출퇴근 기록을 기준으로 직원 급여를 계산합니다",
    workerName: "직원 이름",
    totalHours: "총 근무 시간",
    hourlyWage: "시급",
    estimatedSalary: "예상 급여",
    noPayrollData: "완료된 출퇴근 기록이 없습니다",
    hours: "시간",
  },

  vi: {
    dashboard: "Bảng điều khiển",
    dashboardTitle: "Bảng điều khiển",
    dashboardSubtitle: "Quản lý nhân viên và hoạt động hàng ngày",

    workers: "Nhân viên",
    schedule: "Lịch làm việc",
    attendance: "Chấm công",
    payroll: "Bảng lương",
    tasks: "Công việc",
    settings: "Cài đặt",
    logout: "Đăng xuất",

    qrAttendance: "Chấm Công QR",
    addWorker: "Thêm Nhân Viên",

    totalWorkers: "Tổng Số Nhân Viên",
    activeWorkers: "Nhân viên đang làm việc",
    attendanceLogs: "Nhật ký chấm công",
    scheduledShifts: "Ca làm việc đã lên lịch",

    welcomeBack: "Chào mừng quay lại, Nhân viên",
    manageOperations: "Quản lý nhân viên và hoạt động hàng ngày",
    activeStaff: "Nhân viên đang làm việc",
    todaySales: "Doanh số hôm nay",
    reservations: "Đặt chỗ",
    entryTime: "Thời gian vào ca",
    clockIn: "Vào ca",
    clockOut: "Tan ca",

    workersTitle: "Nhân viên",
    searchWorkers: "Tìm Kiếm Nhân Viên...",

    addStoreTask: "Thêm Công Việc",
    taskTitle: "Tiêu đề Công Việc",
    taskDescription: "Mô Tả Công Việc",
    saveTask: "Lưu Công Việc",

    settingsDescription: "Quản lý cài đặt ứng dụng nhà hàng",
    restaurantName: "Tên nhà hàng",
    currency: "Tiền tệ",
    openingTime: "Giờ mở cửa",
    closingTime: "Giờ đóng cửa",
    defaultHourlyWage: "Lương theo giờ mặc định",
    saveSettings: "Lưu cài đặt",
    settingsSaved: "Đã lưu cài đặt",

    payrollDescription: "Tính lương nhân viên từ dữ liệu chấm công",
    workerName: "Tên nhân viên",
    totalHours: "Tổng giờ",
    hourlyWage: "Lương theo giờ",
    estimatedSalary: "Lương ước tính",
    noPayrollData: "Không có dữ liệu chấm công hoàn chỉnh",
    hours: "giờ",
  },
};

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    function loadLanguage() {
      const savedLanguage = localStorage.getItem("language") as Language | null;

      if (savedLanguage && translations[savedLanguage]) {
        setLanguageState(savedLanguage);
      } else {
        setLanguageState("en");
      }
    }

    loadLanguage();

    window.addEventListener("languageChanged", loadLanguage);
    window.addEventListener("storage", loadLanguage);

    return () => {
      window.removeEventListener("languageChanged", loadLanguage);
      window.removeEventListener("storage", loadLanguage);
    };
  }, []);

  function setLanguage(newLanguage: Language) {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
    window.dispatchEvent(new Event("languageChanged"));
  }

  function t(key: string) {
    return translations[language]?.[key] || key;
  }

  return { language, setLanguage, t };
}