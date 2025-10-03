/**
 * Employee API Integration Layer
 *
 * TODO: Connect to backend API when available
 * This file contains placeholder functions for future backend integration
 * Reference: CLAUDE.md - "comment for business composable for future backend connexion"
 */

import type { Employee } from "~/types";

export const employeeApi = {
  /**
   * TODO: Fetch all employees from backend
   * GET /api/employees
   */
  async getAll(): Promise<Employee[]> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Fetch single employee by ID
   * GET /api/employees/:id
   */
  async getById(id: string): Promise<Employee | null> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Create new employee
   * POST /api/employees
   */
  async create(employee: Omit<Employee, "id">): Promise<Employee> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Update existing employee
   * PUT /api/employees/:id
   */
  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Delete employee
   * DELETE /api/employees/:id
   */
  async delete(id: string): Promise<void> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Search employees
   * GET /api/employees/search?q=query
   */
  async search(query: string): Promise<Employee[]> {
    throw new Error("Backend API not implemented. Using local store data.");
  },

  /**
   * TODO: Get employees by department
   * GET /api/employees/department/:department
   */
  async getByDepartment(department: string): Promise<Employee[]> {
    throw new Error("Backend API not implemented. Using local store data.");
  },
};