export interface Attendance {
    _id?: string;
    student_id: number;
    class_id: number;
    date: Date;
    status: 'present' | 'absent' | 'late';
    comments?: string;
    recordedAt: Date;
    modifiedAt?: Date;
    modifiedBy?: string;
    version: number;
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