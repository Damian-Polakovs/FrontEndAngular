import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BulkAttendanceData, BulkAttendanceResponse, Attendance, PaginatedResponse } from './attendance';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  // Update the API URL to directly use the correct endpoint
  private apiUrl = 'http://localhost:3000/api/attendance';

  constructor(private http: HttpClient) { 
    console.log('API URL:', this.apiUrl); // Add logging to verify the URL
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    // Extract more detailed error information if available
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

  createBulkAttendance(data: BulkAttendanceData): Observable<BulkAttendanceResponse> {
    console.log('Sending bulk attendance request to:', `${this.apiUrl}/bulk`);
    console.log('Request data:', data);
    return this.http.post<BulkAttendanceResponse>(`${this.apiUrl}/bulk`, data)
      .pipe(
        catchError((error) => {
          console.error('Bulk attendance error details:', error);
          return this.handleError(error);
        })
      );
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