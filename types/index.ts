// TypeScript Type Definitions
// These interfaces define the shape of our data throughout the app

export interface Employee {
  id: string           // P001, P002, etc.
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
  date: string         // ISO date format (YYYY-MM-DD)
  type: AbsenceType
  reason?: string
  approved?: boolean
  approvedBy?: string
  notes?: string
}

export type AbsenceType = 'sick' | 'vacation' | 'personal' | 'other'

export type AttendanceStatus = 'present' | 'absent' | 'weekend' | 'holiday' | 'today'

export interface AttendanceCellData {
  date: string
  status: AttendanceStatus
  absence?: Absence
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee'
  avatar?: string
}

// Helper type for the calendar grid
export interface CalendarDay {
  date: Date
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
}