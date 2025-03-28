import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../../attendance/attendance.service';

interface ClassInfo {
  id: string;
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  studentCount: number;
}

interface StudentInfo {
  student_id: string;
  student_name: string;
  overall_attendance: string;
  class_id: string;
}

@Component({
  selector: 'app-admin-attendance',
  templateUrl: './admin-attendance.component.html',
  styleUrls: ['./admin-attendance.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule
  ]
})
export class AdminAttendanceComponent implements OnInit {
  isLoading = true;
  overallStats: any = {};
  displayedColumns: string[] = ['student_id', 'name', 'overall_attendance'];
  
  //Properties required by the template
  showClassList = true;
  selectedClass: ClassInfo | null = null;
  filteredStudents: StudentInfo[] = [];
  
  //Class schedule
  classSchedule: ClassInfo[] = [
    { id: 'OSD-L-SD', name: 'Open Stack Development Lecture (Software Development)', dayOfWeek: 1, startTime: '09:00', endTime: '11:00', studentCount: 25 },
    { id: 'OSD-L-C', name: 'Open Stack Development Lecture (Computing)', dayOfWeek: 1, startTime: '13:00', endTime: '15:00', studentCount: 20 },
    { id: 'OSD-T-SD', name: 'Open Stack Development Tutorial (Software Development)', dayOfWeek: 3, startTime: '09:00', endTime: '11:00', studentCount: 25 },
    { id: 'OSD-T-C', name: 'Open Stack Development Tutorial (Computing)', dayOfWeek: 3, startTime: '13:00', endTime: '15:00', studentCount: 20 }
  ];

  constructor(
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOverallAttendance();
  }

  loadOverallAttendance(): void {
    this.isLoading = true;
    this.attendanceService.getOverallAttendance().subscribe({
      next: (data) => {
        this.overallStats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading attendance statistics:', error);
        this.snackBar.open('Failed to load attendance statistics', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  exportReport(): void {
    //Implementation for exporting reports
    this.snackBar.open('Report export functionality will be implemented soon', 'Close', { duration: 3000 });
  }
  
  //Methods required by the template
  selectClass(classInfo: ClassInfo): void {
    this.selectedClass = classInfo;
    this.showClassList = false;
    
    //Mock data for filtered students
    this.filteredStudents = [
      { student_id: 'S00212345', student_name: 'John Smith', overall_attendance: '90%', class_id: classInfo.id },
      { student_id: 'S00234567', student_name: 'Emma Johnson', overall_attendance: '85%', class_id: classInfo.id },
      { student_id: 'S00245678', student_name: 'Michael Brown', overall_attendance: '70%', class_id: classInfo.id },
      { student_id: 'S00256789', student_name: 'Sarah Davis', overall_attendance: '95%', class_id: classInfo.id }
    ];
  }
  
  backToClasses(): void {
    this.showClassList = true;
    this.selectedClass = null;
  }
  
  getDayName(dayNumber: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || '';
  }
  
  viewStudentDetails(studentId: string): void {
    this.router.navigate(['/student', studentId]);
  }
  
  getAttendanceClass(attendancePercentage: string): string {
    const percentage = parseInt(attendancePercentage, 10);
    if (percentage >= 90) return 'status-excellent';
    if (percentage >= 80) return 'status-good';
    if (percentage >= 70) return 'status-average';
    return 'status-poor';
  }
}