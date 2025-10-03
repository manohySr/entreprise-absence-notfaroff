import type { Employee, Absence } from "~/types";

export const useStoreHelpers = () => {
  const { employees } = useEmployeeStore();
  const { absences, getEmployeeAbsences } = useAttendanceStore();

  const getEmployeeWithAbsences = (employeeId: string) => {
    const employee = employees.value.find((e) => e.id === employeeId);
    if (!employee) return null;

    const employeeAbsences = getEmployeeAbsences(employeeId);
    return {
      ...employee,
      absences: employeeAbsences,
      totalAbsences: employeeAbsences.length,
      totalDaysAbsent: calculateTotalDaysAbsent(employeeAbsences)
    };
  };

  const calculateTotalDaysAbsent = (absences: Absence[]): number => {
    return absences.reduce((total, absence) => {
      const start = new Date(absence.startDate);
      const end = new Date(absence.endDate);
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);
  };

  const getDepartmentStats = (department: string) => {
    const deptEmployees = employees.value.filter((e) => e.department === department);
    const deptEmployeeIds = deptEmployees.map((e) => e.id);

    const deptAbsences = absences.value.filter((a) =>
      deptEmployeeIds.includes(a.employeeId)
    );

    return {
      department,
      employeeCount: deptEmployees.length,
      totalAbsences: deptAbsences.length,
      approvedAbsences: deptAbsences.filter((a) => a.approved).length,
      pendingAbsences: deptAbsences.filter((a) => !a.approved).length,
    };
  };

  const getCompanyOverview = () => {
    const totalEmployees = employees.value.length;
    const totalAbsences = absences.value.length;
    const approvedAbsences = absences.value.filter((a) => a.approved).length;
    const pendingAbsences = totalAbsences - approvedAbsences;

    const departments = [...new Set(employees.value.map((e) => e.department).filter(Boolean))];
    const departmentStats = departments.map((dept) => getDepartmentStats(dept as string));

    const today = new Date().toISOString().slice(0, 10);
    const currentlyAbsent = absences.value.filter(
      (a) => a.startDate <= today && a.endDate >= today
    ).length;

    return {
      totalEmployees,
      totalAbsences,
      approvedAbsences,
      pendingAbsences,
      currentlyAbsent,
      departmentStats,
      absenceRate: totalEmployees > 0 ? (currentlyAbsent / totalEmployees) * 100 : 0
    };
  };

  const validateEmployeeData = (employee: Partial<Employee>): string[] => {
    const errors: string[] = [];

    if (!employee.firstName?.trim()) {
      errors.push("First name is required");
    }

    if (!employee.lastName?.trim()) {
      errors.push("Last name is required");
    }

    if (employee.email && !isValidEmail(employee.email)) {
      errors.push("Invalid email format");
    }

    if (employee.phone && !isValidPhone(employee.phone)) {
      errors.push("Invalid phone format");
    }

    return errors;
  };

  const validateAbsenceData = (absence: Partial<Absence>): string[] => {
    const errors: string[] = [];

    if (!absence.employeeId) {
      errors.push("Employee ID is required");
    }

    if (!absence.startDate) {
      errors.push("Start date is required");
    }

    if (!absence.endDate) {
      errors.push("End date is required");
    }

    if (absence.startDate && absence.endDate && absence.startDate > absence.endDate) {
      errors.push("End date must be after or equal to start date");
    }

    if (!absence.type) {
      errors.push("Absence type is required");
    }

    return errors;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    getEmployeeWithAbsences,
    calculateTotalDaysAbsent,
    getDepartmentStats,
    getCompanyOverview,
    validateEmployeeData,
    validateAbsenceData,
    exportToCSV,
  };
};