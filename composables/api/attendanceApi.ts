/**
 * Attendance API Integration Layer
 *
 * TODO: Connect to backend API when available
 * This file contains placeholder functions for future backend integration
 * Reference: CLAUDE.md - "comment for business composable for future backend connexion"
 */

import type { Absence } from "~/types";

export const attendanceApi = {
  /**
   * TODO: Fetch all absences
   * GET /api/absences
   */
  async getAllAbsences(): Promise<Absence[]> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Fetch absence by ID
   * GET /api/absences/:id
   */
  async getAbsenceById(id: string): Promise<Absence | null> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Fetch absences for specific employee
   * GET /api/absences/employee/:employeeId
   */
  async getEmployeeAbsences(employeeId: string): Promise<Absence[]> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Create new absence request
   * POST /api/absences
   */
  async createAbsence(absence: Omit<Absence, "id">): Promise<Absence> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Update existing absence
   * PUT /api/absences/:id
   */
  async updateAbsence(id: string, updates: Partial<Absence>): Promise<Absence> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Delete absence
   * DELETE /api/absences/:id
   */
  async deleteAbsence(id: string): Promise<void> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Approve absence request
   * POST /api/absences/:id/approve
   */
  async approveAbsence(id: string, approvedBy: string): Promise<Absence> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Reject absence request
   * POST /api/absences/:id/reject
   */
  async rejectAbsence(id: string, reason?: string): Promise<Absence> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Get absences in date range
   * GET /api/absences/range?start=YYYY-MM-DD&end=YYYY-MM-DD
   */
  async getAbsencesInRange(startDate: string, endDate: string): Promise<Absence[]> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Get attendance statistics
   * GET /api/absences/stats
   */
  async getAttendanceStats(): Promise<any> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Check for absence conflicts
   * POST /api/absences/check-conflict
   */
  async checkConflict(employeeId: string, startDate: string, endDate: string, excludeId?: string): Promise<boolean> {
    throw new Error("Backend API not implemented. Using local store data.");
  },
};