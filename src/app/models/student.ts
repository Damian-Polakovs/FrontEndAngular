export interface Student {
    student_id: string;
    student_name: string;
    status: 'present' | 'late' | 'absent';
    comments?: string;
    class_id: string;
    overall_attendance?: string;
}
