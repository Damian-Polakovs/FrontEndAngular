import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BulkAttendanceData, BulkAttendanceResponse, Attendance } from '../models/attendance';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getAttendances(): Observable<Attendance[]> {
    console.log('Fetching attendances');
    return this.http.get<Attendance[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getAttendance(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createBulkAttendance(data: BulkAttendanceData): Observable<BulkAttendanceResponse> {
    return this.http.post<BulkAttendanceResponse>(`${this.apiUrl}/bulk`, data)
      .pipe(catchError(this.handleError));
  }

  updateAttendance(id: string, data: Partial<Attendance>): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteAttendance(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getOverallAttendance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overall`)
      .pipe(catchError(this.handleError));
  }
}