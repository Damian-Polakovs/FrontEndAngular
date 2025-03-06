import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { BulkAttendanceData, BulkAttendanceResponse, StudentAttendanceRecord } from '../../models/attendance';
import { Student } from '../../models/student';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-attendance',
  templateUrl: './admin-attendance.component.html',
  styleUrls: ['./admin-attendance.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    NavbarComponent,
    RouterModule
  ]
})
export class AdminAttendanceComponent implements OnInit {
  displayedColumns = ['student_id', 'name', 'present', 'comments', 'overall_attendance'];
  
  // Define class schedule
  classSchedule = [
    { id: 'OSD-L-SD', name: 'Open Stack Development Lecture (Software Development)', dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
    { id: 'OSD-L-C', name: 'Open Stack Development Lecture (Computing)', dayOfWeek: 1, startTime: '13:00', endTime: '15:00' },
    { id: 'OSD-T-SD', name: 'Open Stack Development Tutorial (Software Development)', dayOfWeek: 3, startTime: '09:00', endTime: '11:00' },
    { id: 'OSD-T-C', name: 'Open Stack Development Tutorial (Computing)', dayOfWeek: 3, startTime: '13:00', endTime: '15:00' }
  ];

  // Define students
  students: Student[] = [
    { student_id: 'S00212345', student_name: 'John Smith', status: 'present', comments: '', class_id: 'OSD-L-SD', overall_attendance: '95%' },
    { student_id: 'S00234567', student_name: 'Emma Johnson', status: 'present', comments: '', class_id: 'OSD-L-SD', overall_attendance: '88%' },
    { student_id: 'S00245678', student_name: 'Michael Brown', status: 'present', comments: '', class_id: 'OSD-L-C', overall_attendance: '92%' },
    { student_id: 'S00256789', student_name: 'Sarah Davis', status: 'present', comments: '', class_id: 'OSD-L-C', overall_attendance: '78%' },
    { student_id: 'S00267890', student_name: 'David Wilson', status: 'present', comments: '', class_id: 'OSD-T-SD', overall_attendance: '85%' },
    { student_id: 'S00278901', student_name: 'Alice Cooper', status: 'present', comments: '', class_id: 'OSD-T-SD', overall_attendance: '90%' },
    { student_id: 'S00289012', student_name: 'Bob Taylor', status: 'present', comments: '', class_id: 'OSD-T-C', overall_attendance: '75%' },
    { student_id: 'S00290123', student_name: 'Carol White', status: 'present', comments: '', class_id: 'OSD-T-C', overall_attendance: '94%' }
  ];

  filteredStudents: Student[] = [];
  attendanceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private attendanceService: AttendanceService
  ) {
    this.attendanceForm = this.fb.group({
      class_id: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.autoSelectClass();
    this.applyFilter();
  }

  updateAttendance(student: Student, status: 'present' | 'late' | 'absent'): void {
    student.status = status;
  }

  applyFilter(): void {
    const selectedClass = this.attendanceForm.get('class_id')?.value;
    
    if (!selectedClass) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(student => 
        student.class_id === selectedClass
      );
    }
  }

  saveAttendance(): void {
    if (this.attendanceForm.valid) {
      const hasIncompleteRecords = this.filteredStudents.some(student => !student.status);
      
      if (hasIncompleteRecords) {
        this.snackBar.open('Please mark attendance status for all students', 'Close', { 
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      const records: StudentAttendanceRecord[] = this.filteredStudents.map(student => ({
        student_id: student.student_id,
        student_name: student.student_name,
        status: student.status,
        comments: student.comments || ''
      }));

      const attendanceData: BulkAttendanceData = {
        class_id: this.attendanceForm.get('class_id')?.value,
        date: this.attendanceForm.get('date')?.value,
        records: records
      };

      this.attendanceService.createBulkAttendance(attendanceData).subscribe({
        next: (response: BulkAttendanceResponse) => {
          if (response.success) {
            this.snackBar.open(response.message || 'Attendance saved successfully', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/attendance']);
          } else {
            this.snackBar.open(response.message || 'Failed to save attendance', 'Close', { 
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving attendance:', error);
          this.snackBar.open(error.error?.message || 'Failed to save attendance. Please try again.', 'Close', { 
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Please select a class and date', 'Close', { 
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  autoSelectClass(): void {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const currentClass = this.classSchedule.find(cls => {
      const [startHour, startMinute] = cls.startTime.split(':').map(Number);
      const [endHour, endMinute] = cls.endTime.split(':').map(Number);
      const classStartTime = startHour * 100 + startMinute;
      const classEndTime = endHour * 100 + endMinute;

      return cls.dayOfWeek === currentDay && 
             currentTime >= classStartTime && 
             currentTime <= classEndTime;
    });

    if (currentClass) {
      this.attendanceForm.patchValue({ class_id: currentClass.id });
    }
  }
}
