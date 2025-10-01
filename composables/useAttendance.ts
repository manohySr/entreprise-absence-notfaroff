// Composable for Attendance/Absence State Management
// This manages all absence records and attendance logic

import type { Absence, AttendanceStatus } from "~/types";
import { formatDateToString, isWeekend, isSameDay } from "@/utils/dateUtils";

export const useAttendance = () => {
  // State for all absences
  const absences = useState<Absence[]>("absences", () => [
    {
      id: "1",
      employeeId: "P001",
      date: "2025-09-01",
      type: "sick",
      reason: "Flu",
      approved: true,
    },
    {
      id: "2",
      employeeId: "P002",
      date: "2025-09-08",
      type: "vacation",
      reason: "Family trip",
      approved: true,
    },
    {
      id: "3",
      employeeId: "P003",
      date: "2025-09-15",
      type: "personal",
      reason: "Personal matter",
      approved: true,
    },
    {
      id: "4",
      employeeId: "P006",
      date: "2025-09-24",
      type: "sick",
      reason: "Doctor appointment",
      approved: true,
    },
  ]);

  // Get the current date
  const today = new Date();


  const getAttendanceStatus = (
    employeeId: string,
    date: Date,
  ): AttendanceStatus => {
    if (isSameDay(date, today)) {
      return "today";
    }

    if (isWeekend(date)) {
      return "weekend";
    }

    const dateStr = formatDateToString(date);

    const absence = absences.value.find(
      (a) => a.employeeId === employeeId && a.date === dateStr,
    );

    if (absence) {
      return "absent";
    }

    return "present";
  };

  const getEmployeeAbsences = (employeeId: string): Absence[] => {
    return absences.value.filter((a) => a.employeeId === employeeId);
  };

  const getAbsenceByEmployeeAndDate = (
    employeeId: string,
    date: Date,
  ): Absence | undefined => {
    const dateStr = formatDateToString(date);

    return absences.value.find(
      (a) => a.employeeId === employeeId && a.date === dateStr,
    );
  };

  const addAbsence = (absence: Omit<Absence, "id">) => {
    const newId = String(absences.value.length + 1);
    absences.value.push({ ...absence, id: newId, approved: false });
  };

  const updateAbsence = (id: string, updates: Partial<Absence>) => {
    const index = absences.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      absences.value[index] = { ...absences.value[index], ...updates };
    }
  };

  const deleteAbsence = (id: string) => {
    const index = absences.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      absences.value.splice(index, 1);
    }
  };

  const getAbsenceStats = () => {
    const total = absences.value.length;
    const approved = absences.value.filter((a) => a.approved).length;
    const pending = total - approved;
    const byType = absences.value.reduce(
      (acc, absence) => {
        acc[absence.type] = (acc[absence.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, approved, pending, byType };
  };

  return {
    absences,
    getAttendanceStatus,
    getEmployeeAbsences,
    getAbsenceByEmployeeAndDate,
    addAbsence,
    updateAbsence,
    deleteAbsence,
    getAbsenceStats,
    isWeekend,
    isSameDay,
  };
};
