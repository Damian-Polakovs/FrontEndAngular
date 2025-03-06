import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/tasks`; // Adjust if your endpoint is different

  constructor(private http: HttpClient) {}

  getStudentDetails(studentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${studentId}`);
  }

  getStudentAttendance(studentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/attendance/${studentId}`);
  }
} 