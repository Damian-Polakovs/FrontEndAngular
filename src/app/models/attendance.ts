import { PaginatedResponse, BulkAttendanceData } from '../../attendance/attendance';

export interface StudentAttendanceRecord {
  student_id: string;
  student_name: string;
  status: 'present' | 'absent' | 'late';
  comments?: string;
}

export interface Attendance {
  _id?: string;
  class_id: string;
  date: string | Date;
  records: StudentAttendanceRecord[];
}

export interface BulkAttendanceResponse {
  success: boolean;
  message?: string;
  data?: Attendance;
}

//Re-export the types from the attendance module using 'export type'
export type { PaginatedResponse, BulkAttendanceData };
