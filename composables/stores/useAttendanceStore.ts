import type { Absence, AttendanceStatus } from "~/types";
import { formatDateToString, isWeekend, isSameDay, isDateInRange } from "@/utils/dateUtils";

export const useAttendanceStore = () => {
  const absences = useState<Absence[]>("absences", () => [
    {
      id: "1",
      employeeId: "P001",
      startDate: "2025-09-01",
      endDate: "2025-09-01",
      type: "sick",
      reason: "Flu",
      approved: true,
    },
    {
      id: "2",
      employeeId: "P002",
      startDate: "2025-09-08",
      endDate: "2025-09-10",
      type: "vacation",
      reason: "Family trip",
      approved: true,
    },
    {
      id: "3",
      employeeId: "P003",
      startDate: "2025-09-15",
      endDate: "2025-09-15",
      type: "personal",
      reason: "Personal matter",
      approved: true,
    },
    {
      id: "4",
      employeeId: "P006",
      startDate: "2025-09-24",
      endDate: "2025-09-27",
      type: "sick",
      reason: "Doctor appointment and recovery",
      approved: true,
    },
  ]);

  const today = new Date();

  const generateNextAbsenceId = (): string => {
    const maxId = Math.max(
      0,
      ...absences.value.map((a) => parseInt(a.id || "0") || 0)
    );
    return String(maxId + 1);
  };

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
      (a) => a.employeeId === employeeId && isDateInRange(dateStr, a.startDate, a.endDate),
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
      (a) => a.employeeId === employeeId && isDateInRange(dateStr, a.startDate, a.endDate),
    );
  };

  const getAbsencesInDateRange = (startDate: string, endDate: string): Absence[] => {
    return absences.value.filter(
      (a) => !(a.endDate < startDate || a.startDate > endDate)
    );
  };

  const addAbsence = (absence: Omit<Absence, "id">): Absence => {
    const newAbsence: Absence = {
      ...absence,
      id: generateNextAbsenceId(),
      approved: absence.approved ?? false,
    };
    absences.value.push(newAbsence);
    return newAbsence;
  };

  const updateAbsence = (id: string, updates: Partial<Absence>): boolean => {
    const index = absences.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      absences.value[index] = { ...absences.value[index], ...updates };
      return true;
    }
    return false;
  };

  const deleteAbsence = (id: string): boolean => {
    const index = absences.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      absences.value.splice(index, 1);
      return true;
    }
    return false;
  };

  const approveAbsence = (id: string, approvedBy: string): boolean => {
    return updateAbsence(id, {
      approved: true,
      approvedBy,
      notes: `Approved on ${formatDateToString(new Date())}`
    });
  };

  const rejectAbsence = (id: string, reason?: string): boolean => {
    return updateAbsence(id, {
      approved: false,
      notes: reason ? `Rejected: ${reason}` : "Rejected"
    });
  };

  const splitAbsenceAtDate = (absence: Absence, splitDate: Date): Absence[] => {
    const splitDateStr = formatDateToString(splitDate);
    const remainingAbsences: Absence[] = [];

    const beforeDate = new Date(splitDate);
    beforeDate.setDate(beforeDate.getDate() - 1);
    const beforeDateStr = formatDateToString(beforeDate);

    const afterDate = new Date(splitDate);
    afterDate.setDate(afterDate.getDate() + 1);
    const afterDateStr = formatDateToString(afterDate);

    if (absence.startDate < splitDateStr) {
      remainingAbsences.push({
        ...absence,
        id: undefined,
        endDate: beforeDateStr,
      });
    }

    if (absence.endDate > splitDateStr) {
      remainingAbsences.push({
        ...absence,
        id: undefined,
        startDate: afterDateStr,
      });
    }

    return remainingAbsences;
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

    const byEmployee = absences.value.reduce(
      (acc, absence) => {
        acc[absence.employeeId] = (acc[absence.employeeId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthAbsences = absences.value.filter(
      (a) => a.startDate.startsWith(currentMonth) || a.endDate.startsWith(currentMonth)
    );

    return {
      total,
      approved,
      pending,
      byType,
      byEmployee,
      currentMonth: currentMonthAbsences.length
    };
  };

  const validateAbsenceOverlap = (
    employeeId: string,
    startDate: string,
    endDate: string,
    excludeId?: string
  ): boolean => {
    return !absences.value.some((a) => {
      if (a.employeeId !== employeeId || a.id === excludeId) {
        return false;
      }
      return !(endDate < a.startDate || startDate > a.endDate);
    });
  };

  return {
    absences: readonly(absences),
    getAttendanceStatus,
    getEmployeeAbsences,
    getAbsenceByEmployeeAndDate,
    getAbsencesInDateRange,
    addAbsence,
    updateAbsence,
    deleteAbsence,
    approveAbsence,
    rejectAbsence,
    splitAbsenceAtDate,
    getAbsenceStats,
    validateAbsenceOverlap,
    generateNextAbsenceId,
  };
};