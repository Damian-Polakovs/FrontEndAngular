export interface Grade {
    _id?: string;
    student_id: number;
    class_id: number;
    score: number;
    type: 'exam' | 'quiz' | 'homework';
}
export interface GradeHistory {
    _id?: string;
    student_id: number;
    class_id: number;
    scores: {
        type: 'exam' | 'quiz' | 'homework';
        score: number;
    }[];
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