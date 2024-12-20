import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Attendance, PaginatedResponse } from '../models/attendance';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    private apiUrl = `${environment.apiUrl}/attendance`;

    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }

    getAttendances(params?: any): Observable<PaginatedResponse<Attendance>> {
        console.log('Fetching attendances with params:', params);
        return this.http.get<PaginatedResponse<Attendance>>(this.apiUrl, { params });
    }

    getAttendance(id: string): Observable<Attendance> {
        return this.http.get<Attendance>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    createAttendance(attendance: Attendance): Observable<Attendance> {
        return this.http.post<Attendance>(this.apiUrl, attendance)
            .pipe(
                catchError(this.handleError)
            );
    }

    updateAttendance(id: string, attendance: Attendance): Observable<Attendance> {
        return this.http.put<Attendance>(`${this.apiUrl}/${id}`, attendance)
            .pipe(
                catchError(this.handleError)
            );
    }

    deleteAttendance(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }
}