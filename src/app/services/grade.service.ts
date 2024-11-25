import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grade } from '../models/grade';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GradeService {
    private apiUrl = `${environment.apiUrl}/gradeHistories`;

    constructor(private http: HttpClient) {}

    getGrades(): Observable<Grade[]> {
        return this.http.get<Grade[]>(this.apiUrl);
    }

    getGrade(id: string): Observable<Grade> {
        return this.http.get<Grade>(`${this.apiUrl}/${id}`);
    }

    createGrade(grade: Grade): Observable<any> {
        return this.http.post(this.apiUrl, grade);
    }

    updateGrade(id: string, grade: Grade): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, grade);
    }

    deleteGrade(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
