import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance, PaginatedResponse } from '../models/attendance';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private apiUrl = `${environment.apiUrl}/attendance`;

    constructor(private http: HttpClient) {
        console.log('AttendanceService initialized with URL:', this.apiUrl);
    }

    getAttendances(): Observable<PaginatedResponse<Attendance>> {
        const url = this.apiUrl;
        console.log('Fetching attendances from:', url);
        return this.http.get<PaginatedResponse<Attendance>>(url);
    }

    getAttendance(id: string): Observable<Attendance> {
        const url = `${this.apiUrl}/${id}`;
        console.log('Fetching attendance by id from:', url);
        return this.http.get<Attendance>(url);
    }

    createAttendance(attendance: Attendance): Observable<Attendance> {
        console.log('Creating attendance at:', this.apiUrl);
        return this.http.post<Attendance>(this.apiUrl, attendance);
    }

    updateAttendance(id: string, attendance: Attendance): Observable<Attendance> {
        const url = `${this.apiUrl}/${id}`;
        console.log('Updating attendance at:', url);
        return this.http.put<Attendance>(url, attendance);
    }

    deleteAttendance(id: string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        console.log('Deleting attendance at:', url);
        return this.http.delete<void>(url);
    }
}