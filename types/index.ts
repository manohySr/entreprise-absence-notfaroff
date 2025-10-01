export interface Employee {
  id: string
  firstName: string
  lastName: string
  department?: string
  email?: string
  phone?: string
  position?: string
  startDate?: string
}

export interface Absence {
  id?: string
  employeeId: string
  startDate: string    // ISO date format (YYYY-MM-DD)
  endDate: string      // ISO date format (YYYY-MM-DD) - inclusive
  type: AbsenceType
  reason?: string
  approved?: boolean
  approvedBy?: string
  notes?: string
}

export type AbsenceType = 'sick' | 'vacation' | 'personal' | 'medical' | 'maternity' | 'paternity' | 'bereavement' | 'present' | 'other'

export type AttendanceStatus = 'present' | 'absent' | 'weekend' | 'holiday' | 'today'

export const ABSENCE_TYPE_LABELS = [
  "Vacation",
  "Sick Leave",
  "Personal Leave",
  "Medical Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Bereavement Leave",
  "Present",
  "Other",
] as const;

export const ABSENCE_TYPE_MAP: Record<AbsenceType, string> = {
  sick: "Sick Leave",
  vacation: "Vacation",
  personal: "Personal Leave",
  medical: "Medical Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
  bereavement: "Bereavement Leave",
  present: "Present",
  other: "Other",
};

/**
 * Converts backend absence type to human-readable label
 */
export const mapAbsenceTypeToLabel = (type: AbsenceType): string => {
  return ABSENCE_TYPE_MAP[type] || "Other";
};

/**
 * Converts human-readable label to backend absence type
 */
export const mapLabelToAbsenceType = (label: string): AbsenceType => {
  const entry = Object.entries(ABSENCE_TYPE_MAP).find(([_, value]) => value === label);
  return (entry?.[0] as AbsenceType) || 'other';
};