import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Attendance, BulkAttendanceData, BulkAttendanceResponse, PaginatedResponse } from '../app/models/attendance';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = environment.apiUrl + '/api/attendance';

  constructor(private http: HttpClient) { 
    console.log('API URL:', this.apiUrl);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error && error.error.message) {
      errorMessage = `Server error: ${error.error.message}`;
      if (error.error.error) {
        errorMessage += ` (${error.error.error})`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  getAttendances(params?: any): Observable<PaginatedResponse<Attendance>> {
    console.log('Fetching attendances with params:', params);
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    
    return this.http.get<PaginatedResponse<Attendance>>(this.apiUrl, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  getAttendance(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getOverallAttendance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`)
      .pipe(catchError(this.handleError));
  }

  updateAttendance(id: string, data: Partial<Attendance>): Observable<Attendance> {
    console.log('Updating attendance:', { id, data });
    return this.http.put<Attendance>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteAttendance(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createBulkAttendance(data: BulkAttendanceData): Observable<BulkAttendanceResponse> {
    return this.http.post<BulkAttendanceResponse>(`${this.apiUrl}/bulk`, data)
      .pipe(catchError(this.handleError));
  }
}