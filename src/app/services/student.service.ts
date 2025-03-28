import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/api`; // Updated from /tasks to /api

  constructor(private http: HttpClient) {}

  getStudentDetails(studentId: string): Observable<any> {
    // Return mock data directly for now to ensure it works
    return of(this.getMockStudentDetails(studentId));
    
    // Uncomment this when API is ready
    // return this.http.get(`${this.apiUrl}/students/${studentId}`)
    //   .pipe(catchError(() => of(this.getMockStudentDetails(studentId))));
  }

  getStudentAttendance(studentId: string): Observable<any> {
    // Return mock data directly for now to ensure it works
    return of(this.getMockAttendanceData(studentId));
    
    // Uncomment this when API is ready
    // return this.http.get(`${this.apiUrl}/attendance/student/${studentId}`)
    //   .pipe(catchError(() => of(this.getMockAttendanceData(studentId))));
  }

  // Mock data for development
  private getMockStudentDetails(studentId: string): any {
    return {
      id: studentId,
      name: this.getStudentNameById(studentId),
      email: `${studentId.toLowerCase()}@example.com`,
      program: 'Computing',
      year: 2
    };
  }

  private getStudentNameById(studentId: string): string {
    const studentMap: {[key: string]: string} = {
      'S00212345': 'John Smith',
      'S00234567': 'Emma Johnson',
      'S00245678': 'Michael Brown',
      'S00256789': 'Sarah Davis',
      'S00267890': 'David Wilson',
      'S00278901': 'Alice Cooper',
      'S00289012': 'Bob Taylor',
      'S00290123': 'Carol White'
    };
    return studentMap[studentId] || 'Unknown Student';
  }

  private getStudentClasses(studentId: string): string[] {
    // Map students to their classes
    const studentClassMap: Record<string, string[]> = {
      'S00212345': ['OSD-L-SD'],
      'S00234567': ['OSD-L-SD'],
      'S00245678': ['OSD-L-C'],
      'S00256789': ['OSD-L-C'],
      'S00267890': ['OSD-T-SD'],
      'S00278901': ['OSD-T-SD'],
      'S00289012': ['OSD-T-C'],
      'S00290123': ['OSD-T-C']
    };
    
    return studentClassMap[studentId] || [];
  }

  private getMockAttendanceData(studentId: string): any[] {
    // Get the classes this student attends
    const studentClasses = this.getStudentClasses(studentId);
    if (studentClasses.length === 0) return [];
    
    // Generate 10 attendance records with various statuses
    const records = [];
    const statuses = ['Present', 'Present', 'Present', 'Late', 'Absent', 'Present', 'Present', 'Late', 'Present', 'Present'];
    const classMap: Record<string, string> = {
      'OSD-L-SD': 'Open Stack Development Lecture (Software Development)',
      'OSD-L-C': 'Open Stack Development Lecture (Computing)',
      'OSD-T-SD': 'Open Stack Development Tutorial (Software Development)',
      'OSD-T-C': 'Open Stack Development Tutorial (Computing)'
    };
    
    // Create attendance records for the past 10 days
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Only use classes that this student attends
      const classId = studentClasses[0]; // Use the first class for this student
      const status = statuses[i];
      
      records.push({
        date: date.toISOString(),
        class: classMap[classId],
        class_id: classId,
        status: status,
        comments: status === 'Late' ? 'Arrived 10 minutes late' : 
                 status === 'Absent' ? 'No notification provided' : ''
      });
    }
    
    return records;
  }
}