import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance, PaginatedResponse } from '../../models/attendance';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
        CommonModule
    ]
})
export class AttendanceListComponent implements OnInit {
    dataSource = new MatTableDataSource<Attendance>([]);
    displayedColumns: string[] = ['student_id', 'class_id', 'date', 'status', 'actions'];

    constructor(
        private attendanceService: AttendanceService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadAttendances();
    }

    loadAttendances(): void {
        this.attendanceService.getAttendances().subscribe({
            next: (response: PaginatedResponse<Attendance>) => {
                this.dataSource.data = response.data;
            },
            error: (error) => {
                console.error('Failed to load attendance records', error);
                this.snackBar.open('Failed to load attendance records', 'Close', { duration: 3000 });
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