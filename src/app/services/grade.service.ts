import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grade } from '../models/grade';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class GradeService {
    private apiUrl = 'http://localhost:3000/api/v1/gradeHistories';

    constructor(private http: HttpClient) {}

    getGrades(): Observable<Grade[]> {
        return this.http.get<Grade[]>(this.apiUrl);
    }

    getGrade(id: string): Observable<Grade> {
        return this.http.get<Grade>(`${this.apiUrl}/${id}`);
    }

    createGrade(grade: Grade): Observable<any> {
        const gradeHistoryPayload = {
            student_id: grade.student_id,
            class_id: grade.class_id,
            scores: [{
                type: grade.type,
                score: grade.score
            }]
        };
        return this.http.post(this.apiUrl, gradeHistoryPayload);
    }

    updateGrade(id: string, grade: Grade): Observable<any> {
        const gradeHistoryPayload = {
            student_id: grade.student_id,
            class_id: grade.class_id,
            scores: [{
                type: grade.type,
                score: grade.score
            }]
        };
        return this.http.put(`${this.apiUrl}/${id}`, gradeHistoryPayload);
    }

    deleteGrade(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}