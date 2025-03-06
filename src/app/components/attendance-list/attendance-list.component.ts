import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance, PaginatedResponse } from '../../models/attendance';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-attendance-list',
    templateUrl: './attendance-list.component.html',
    styleUrls: ['./attendance-list.component.css'],
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule
    ]
})
export class AttendanceListComponent implements OnInit {
  isLoading = false;
    dataSource = new MatTableDataSource<Attendance>([]);
    displayedColumns: string[] = ['student_id', 'student_name', 'class_id', 'date', 'status', 'actions'];
    searchForm: FormGroup;

    constructor(
        private attendanceService: AttendanceService,
        private snackBar: MatSnackBar,
        private fb: FormBuilder
    ) {
        this.searchForm = this.fb.group({
            student_id: [''],
            class_id: [''],
            startDate: [null],
            endDate: [null]
        });
    }

    ngOnInit(): void {
        this.loadAttendances();
        this.setupSearchSubscription();
    }

    setupSearchSubscription(): void {
        this.searchForm.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(() => {
            this.applyFilter();
        });
    }

    applyFilter(): void {
        const filters = this.searchForm.value;
        
        this.dataSource.filterPredicate = (data: Attendance, _: string) => {
            let matchesStudentId = true;
            let matchesClassId = true;
            let matchesDateRange = true;

            if (filters.student_id) {
                matchesStudentId = data.student_id.toString().includes(filters.student_id);
            }

            if (filters.class_id) {
                matchesClassId = data.class_id.toString().includes(filters.class_id);
            }

            if (filters.startDate && filters.endDate) {
                const recordDate = new Date(data.date);
                matchesDateRange = recordDate >= filters.startDate &&
                                 recordDate <= filters.endDate;
            }

            return matchesStudentId && matchesClassId && matchesDateRange;
        };

        this.dataSource.filter = 'trigger'; // Any string will do, as we're using custom filterPredicate
    }

    clearFilters(): void {
        this.searchForm.reset();
        this.dataSource.filter = '';
    }

    loadAttendances(): void {
      this.isLoading = true;
      const filters = this.searchForm.value;
      
      // Prepare query parameters
      const params: any = {};
      if (filters.student_id) params.student_id = filters.student_id;
      if (filters.class_id) params.class_id = filters.class_id;
      if (filters.startDate) params.startDate = filters.startDate.toISOString();
      if (filters.endDate) params.endDate = filters.endDate.toISOString();
  
      // Pass params to the service
      this.attendanceService.getAttendances(params).subscribe({
          next: (response: PaginatedResponse<Attendance>) => {
              this.dataSource.data = response.data;
              this.isLoading = false;
          },
          error: (error) => {
              console.error('Failed to load attendance records', error);
              this.snackBar.open('Failed to load attendance records', 'Close', { duration: 3000 });
              this.isLoading = false;
          }
      });
    }

    deleteAttendance(id: string): void {
        if (confirm('Are you sure you want to delete this attendance record?')) {
            this.attendanceService.deleteAttendance(id).subscribe({
                next: () => {
                    this.loadAttendances();
                    this.snackBar.open('Attendance record deleted successfully', 'Close', { duration: 3000 });
                },
                error: () => this.snackBar.open('Failed to delete attendance record', 'Close', { duration: 3000 })
            });
        }
    }
}
