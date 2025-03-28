export interface StudentAttendanceRecord {
    student_id: string;
    student_name: string;
    status: 'present' | 'late' | 'absent';
    comments?: string;
}

export interface Attendance {
    _id?: string;
    class_id: string;
    date: Date;
    students: StudentAttendanceRecord[];
    dateCreated?: Date;
    lastUpdated?: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    metadata: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export interface BulkAttendanceData {
    class_id: string;
    date: Date;
    records: StudentAttendanceRecord[];
}

export interface BulkAttendanceResponse {
    success: boolean;
    message: string;
    data?: Attendance;
}