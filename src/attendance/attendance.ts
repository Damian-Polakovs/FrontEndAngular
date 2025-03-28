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
    dateCreated?: Date;
    lastUpdated?: Date;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

export interface BulkAttendanceData {
    class_id: string;
    date: string | Date;
    records: StudentAttendanceRecord[];
}

export interface BulkAttendanceResponse {
    success: boolean;
    message?: string;
    data?: Attendance;
}