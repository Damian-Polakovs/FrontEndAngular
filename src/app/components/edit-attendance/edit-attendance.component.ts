import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { AttendanceService } from '../../../attendance/attendance.service';
import { Attendance, StudentAttendanceRecord } from '../../models/attendance';

interface Student {
  student_id: string;
  student_name: string;
  status: 'present' | 'absent' | 'late';
  comments: string;
  class_id: string;
}

@Component({
  selector: 'app-edit-attendance',
  templateUrl: './edit-attendance.component.html',
  styleUrls: ['./edit-attendance.component.css'],
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
export class EditAttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  attendanceId: string | null = null;
  attendance: Attendance | null = null;
  isLoading = true;
  displayedColumns = ['student_id', 'name', 'present', 'comments', 'class'];
  showingAllClasses = false;
  filteredStudents: Student[] = [];

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar
  ) {
    this.attendanceForm = this.fb.group({
      class_id: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    //Get attendance ID from query params
    this.route.queryParams.subscribe(params => {
      this.attendanceId = params['id'];
      if (this.attendanceId) {
        this.loadAttendance(this.attendanceId);
      } else {
        this.isLoading = false;
        this.snackBar.open('No attendance record specified', 'Close', { duration: 3000 });
        this.router.navigate(['/attendance']);
      }
    });

    //Initialise filtered students
    this.filteredStudents = this.students;
  }

  loadAttendance(id: string): void {
    this.isLoading = true;
    this.attendanceService.getAttendance(id).subscribe({
      next: (data) => {
        this.attendance = data;
        this.attendanceForm.patchValue({
          class_id: data.class_id,
          date: new Date(data.date)
        });
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading attendance:', error);
        this.snackBar.open('Failed to load attendance record', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/attendance']);
      }
    });
  }

  updateStatus(student: StudentAttendanceRecord, status: 'present' | 'late' | 'absent'): void {
    student.status = status;
  }

  applyFilter(): void {
    const selectedClass = this.attendanceForm.get('class_id')?.value;
    
    if (!selectedClass || selectedClass === '') {
      //If no class is selected, show all students
      this.filteredStudents = this.students;
      this.showingAllClasses = false;
    } else if (selectedClass === 'all') {
      //Show all classes
      this.filteredStudents = this.students;
      this.showingAllClasses = true;
    } else {
      //Filter students by the selected class
      this.filteredStudents = this.students.filter(student => 
        student.class_id === selectedClass
      );
      this.showingAllClasses = false;
    }
  }

  getClassName(classId: string): string {
    const classInfo = this.classSchedule.find(c => c.id === classId);
    return classInfo ? classInfo.name : classId;
  }

  exportToCSV(): void {
    //Implementation for CSV export
    console.log('Exporting to CSV...');
    this.snackBar.open('CSV export functionality will be implemented soon', 'Close', { duration: 3000 });
  }

  saveAttendance(): void {
    if (this.attendanceForm.valid) {
      const selectedClass = this.attendanceForm.get('class_id')?.value;
      const selectedDate = this.attendanceForm.get('date')?.value;
      
      if (this.attendanceId && this.attendance) {
        //Update existing attendance record
        const updatedData = {
          class_id: selectedClass,
          date: selectedDate,
          students: this.filteredStudents.map(student => ({
            student_id: student.student_id,
            student_name: student.student_name,
            status: student.status,
            comments: student.comments
          })) as StudentAttendanceRecord[]
        };

        this.attendanceService.updateAttendance(this.attendanceId, updatedData).subscribe({
          next: () => {
            this.snackBar.open('Attendance record updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/attendance']);
          },
          error: (error) => {
            console.error('Error updating attendance:', error);
            this.snackBar.open('Failed to update attendance record', 'Close', { duration: 3000 });
          }
        });
      } else {
        //Create new attendance record
        const attendanceData = {
          class_id: selectedClass,
          date: selectedDate,
          records: this.filteredStudents.map(student => ({
            student_id: student.student_id,
            student_name: student.student_name,
            status: student.status,
            comments: student.comments
          })) as StudentAttendanceRecord[]
        };

        this.attendanceService.createBulkAttendance(attendanceData).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open(response.message || 'Attendance saved successfully', 'Close', { duration: 3000 });
              this.router.navigate(['/attendance']);
            } else {
              this.snackBar.open(response.message || 'Failed to save attendance', 'Close', { duration: 3000 });
            }
          },
          error: (error) => {
            console.error('Error saving attendance:', error);
            this.snackBar.open('Error saving attendance', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/attendance']);
  }
}