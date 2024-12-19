import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance, PaginatedResponse } from '../models/attendance';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private apiUrl = 'http://localhost:3000/api/v1/attendance';

    constructor(private http: HttpClient) {}

    getAttendances(): Observable<PaginatedResponse<Attendance>> {
        return this.http.get<PaginatedResponse<Attendance>>(this.apiUrl);
    }

    getAttendance(id: string): Observable<Attendance> {
        return this.http.get<Attendance>(`${this.apiUrl}/${id}`);
    }

    createAttendance(attendance: Attendance): Observable<any> {
        return this.http.post(this.apiUrl, attendance);
    }

    updateAttendance(id: string, attendance: Attendance): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, attendance);
    }

    deleteAttendance(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}