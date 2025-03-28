import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AttendanceService } from '../../../attendance/attendance.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BulkAttendanceResponse } from '../../models/attendance';
import { StateService, ClassAttendance, AttendanceRecord } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Student {
  student_id: string;
  student_name: string;
  status: 'present' | 'absent' | 'late';
  comments: string;
  class_id: string;
}

interface StudentAttendanceRecord {
  student_id: string;
  student_name: string;
  status: 'present' | 'absent' | 'late';
  comments: string;
}

interface BulkAttendanceData {
  class_id: string;
  date: Date;
  records: StudentAttendanceRecord[];
}

@Component({
  selector: 'app-attendance-form',
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.css', '../../styles/shared-styles.css'],
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
    MatMenuModule,
    RouterModule
  ]
})
export class AttendanceFormComponent implements OnInit {
  displayedColumns = ['student_id', 'name', 'present', 'comments'];
  
  //Class schedule
  classSchedule = [
    { id: 'OSD-L-SD', name: 'Open Stack Development Lecture (Software Development)', dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
    { id: 'OSD-L-C', name: 'Open Stack Development Lecture (Computing)', dayOfWeek: 1, startTime: '13:00', endTime: '15:00' },
    { id: 'OSD-T-SD', name: 'Open Stack Development Tutorial (Software Development)', dayOfWeek: 3, startTime: '09:00', endTime: '11:00' },
    { id: 'OSD-T-C', name: 'Open Stack Development Tutorial (Computing)', dayOfWeek: 3, startTime: '13:00', endTime: '15:00' }
  ];

  //Students
  students: Student[] = [
    { student_id: 'S00212345', student_name: 'John Smith', status: 'present', comments: '', class_id: 'OSD-L-SD' },
    { student_id: 'S00234567', student_name: 'Emma Johnson', status: 'present', comments: '', class_id: 'OSD-L-SD' },
    { student_id: 'S00245678', student_name: 'Michael Brown', status: 'present', comments: '', class_id: 'OSD-L-C' },
    { student_id: 'S00256789', student_name: 'Sarah Davis', status: 'present', comments: '', class_id: 'OSD-L-C' },
    { student_id: 'S00267890', student_name: 'David Wilson', status: 'present', comments: '', class_id: 'OSD-T-SD' },
    { student_id: 'S00278901', student_name: 'Alice Cooper', status: 'present', comments: '', class_id: 'OSD-T-SD' },
    { student_id: 'S00289012', student_name: 'Bob Taylor', status: 'present', comments: '', class_id: 'OSD-T-C' },
    { student_id: 'S00290123', student_name: 'Carol White', status: 'present', comments: '', class_id: 'OSD-T-C' }
  ];

  filteredStudents: Student[] = [];
  attendanceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private attendanceService: AttendanceService,
    private stateService: StateService
  ) {
    this.attendanceForm = this.fb.group({
      class_id: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    //Initialise with all students
    this.filteredStudents = this.students;
    
    this.autoSelectClass();
    
    //Set up form value changes subscription
    this.attendanceForm.get('class_id')?.valueChanges.subscribe((value) => {
      this.applyFilter();
    });
  }

  updateAttendance(student: Student, status: 'present' | 'late' | 'absent'): void {
    student.status = status;
  }

  applyFilter(): void {
    const selectedClass = this.attendanceForm.get('class_id')?.value;
    
    if (!selectedClass || selectedClass === '') {
      //If no class is selected, show all students
      this.filteredStudents = this.students;
    } else {
      //Filter students by the selected class
      this.filteredStudents = this.students.filter(student => 
        student.class_id === selectedClass
      );
    }
  }

  exportToCSV(): void {
    //Implementation for CSV export
    console.log('Exporting to CSV...');
  }

  saveAttendance(): void {
    if (this.attendanceForm.valid) {
      const selectedClass = this.attendanceForm.get('class_id')?.value;
      const selectedDate = this.attendanceForm.get('date')?.value;
      
      //Convert student records to the format expected by the API
      const records = this.filteredStudents.map(student => {
        return {
          student_id: student.student_id,
          student_name: student.student_name,
          status: student.status,
          comments: student.comments
        };
      });
      
      //Create the attendance data object for the API
      const attendanceData = {
        class_id: selectedClass,
        date: selectedDate,
        records: records
      };

      this.attendanceService.createBulkAttendance(attendanceData).subscribe({
        next: (response: BulkAttendanceResponse) => {
          if (response.success) {
            this.snackBar.open(response.message || 'Attendance saved successfully', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            
            //Convert to ClassAttendance format for state management
            const stateAttendanceData: ClassAttendance = {
              class_id: selectedClass,
              date: selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : selectedDate,
              records: this.filteredStudents.map(student => ({
                student_id: student.student_id,
                status: student.status,
                notes: student.comments || ''
              }))
            };
            
            this.stateService.addAttendanceRecord(stateAttendanceData);
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
          let errorMessage = 'Error saving attendance';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.snackBar.open(errorMessage, 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Please fill out all required fields', 'Close', { 
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/attendance']);
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
      this.stateService.setCurrentClass(currentClass.id);
      this.applyFilter();
    } else {
      //If no class is currently in session, show all students
      this.filteredStudents = this.students;
    }
  }
}