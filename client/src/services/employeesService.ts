import { authService } from './authService';

interface Employee {
  id: number;
  full_name: string;
  email: string;
  department: string;
  job_title: string;
  emp_code: string;
  mobile: string;
  is_active: boolean;
  date_joined: string;
}

interface EmployeesResponse {
  success: boolean;
  users: Employee[];
  count: number;
  processing_time_ms: number;
  api_type: string;
}

class EmployeesService {
  private baseUrl = "http://127.0.0.1:8000";

  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await authService.makeAuthenticatedRequest(`${this.baseUrl}/api/users-list/`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EmployeesResponse = await response.json();

      if (data.success && data.users) {
        return data.users.map(user => ({
          id: user.id,
          full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
          email: user.email,
          department: user.department || '',
          job_title: user.job_title || '',
          emp_code: user.emp_code || '',
          mobile: user.mobile || '',
          is_active: user.is_active,
          date_joined: user.date_joined
        }));
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }
}

export const employeesService = new EmployeesService();
export type { Employee };