"use client";
import { useEffect, useState } from "react";
export function useLanguage() {
  const [language, setLanguageState] = useState<keyof typeof translations>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as keyof typeof translations;

    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }

    const handleStorageChange = () => {
      const updatedLanguage = localStorage.getItem("language") as keyof typeof translations;

      if (updatedLanguage && translations[updatedLanguage]) {
        setLanguageState(updatedLanguage);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChanged", handleStorageChange);
    };
  }, []);

  const t = (key: string) => {
    const selectedTranslations = translations[language] as Record<string, string>;
    return selectedTranslations?.[key] || key;
  };

  return { language, t };
}
export const translations = {
  en: {
    activeWorkers: "Active Workers",
    attendanceLogs: "Attendance Logs",
    scheduledShifts: "Scheduled Shifts",
    dashboard: "Dashboard",
    workers: "Workers",
    schedule: "Schedule",
    attendance: "Attendance",
    tasks: "Tasks",
    settings: "Settings",
    logout: "Logout",
    workersTitle: "Workers",
    addWorker: "Add Worker",
    addStoreTask: "Add Store Task",
    taskTitle: "Task title",
    taskDescription: "Task description",
    saveTask: "Save Task",
    searchWorkers: "Search workers...",
    dashboardTitle: "Dashboard",
    qrAttendance: "QR Attendance",
    totalWorkers: "Total Workers",
    welcomeBack: "Welcome back, Staff",
    manageOperations: "Manage workers and daily operations",
    activeStaff: "Active Staff",
    todaySales: "Today Sales",
    reservations: "Reservations",
    entryTime: "Entry Time",
    },
  ko: {
    activeWorkers: "근무 중 직원",
    attendanceLogs: "출근 기록",
    scheduledShifts: "예정 근무",
    dashboard: "대시보드",
    workers: "직원",
    schedule: "일정",
    attendance: "출근관리",
    tasks: "업무",
    settings: "설정",
    logout: "로그아웃",
    workersTitle: "직원",
    addWorker: "직원 추가",
    addStoreTask: "업무 추가",
    taskTitle: "업무 제목",
    taskDescription: "업무 설명",
    saveTask: "업무 저장",
    searchWorkers: "직원 검색...",
    dashboardTitle: "대시보드",
    qrAttendance: "QR 출근",
    totalWorkers: "전체 직원",
    welcomeBack: "다시 오신 것을 환영합니다, 직원님",
    manageOperations: "직원과 일일 운영을 관리하세요",
    activeStaff: "근무 중 직원",
    todaySales: "오늘 매출",
    reservations: "예약",
    entryTime: "출근 시간",
  },
  vi: {
    activeWorkers: "Nhân viên đang làm việc",
    attendanceLogs: "Nhật ký chấm công",
    scheduledShifts: "Ca làm việc đã lên lịch",
    dashboard: "Bảng điều khiển",
    workers: "Nhân viên",
    schedule: "Lịch làm việc",
    attendance: "Chấm công",
    tasks: "Công việc",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    workersTitle: "Nhân viên",
    addWorker: "Thêm Nhân Viên",
    addStoreTask: "Thêm Công Việc",
    taskTitle: "Tiêu đề Công Việc",
    taskDescription: "Mô Tả Công Việc",
    saveTask: "Lưu Công Việc",
    searchWorkers: "Tìm Kiếm Nhân Viên...",
    dashboardTitle: "Bảng Điều Khiển",
    qrAttendance: "Chấm Công QR",
    totalWorkers: "Tổng Số Nhân Viên",
    welcomeBack: "Chào mừng quay lại, Nhân viên",
    manageOperations: "Quản lý nhân viên và hoạt động hàng ngày",
    activeStaff: "Nhân viên đang làm việc",
    todaySales: "Doanh số hôm nay",
    reservations: "Đặt chỗ",
    entryTime: "Thời gian vào ca",
  },
};

export type Language = "en" | "ko" | "vi";