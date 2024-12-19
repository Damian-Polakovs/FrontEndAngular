import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-attendance-form',
    templateUrl: './attendance-form.component.html',
    styleUrls: ['./attendance-form.component.css'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        RouterLink,
        CommonModule
    ]
})
export class AttendanceFormComponent implements OnInit {
    attendanceForm: FormGroup;
    isEditMode = false;
    attendanceId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private attendanceService: AttendanceService,
        private snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.attendanceForm = this.fb.group({
            student_id: ['', [Validators.required, Validators.min(1)]],
            class_id: ['', [Validators.required, Validators.min(1)]],
            date: ['', [Validators.required]],
            status: ['', Validators.required],
            comments: ['']
        });
    }

    ngOnInit(): void {
        this.attendanceId = this.route.snapshot.paramMap.get('id');
        if (this.attendanceId) {
            this.isEditMode = true;
            this.loadAttendance();
        }
    }

    loadAttendance(): void {
        if (this.attendanceId) {
            this.attendanceService.getAttendance(this.attendanceId).subscribe({
                next: (attendance) => {
                    const formattedAttendance = {
                        ...attendance,
                        date: this.formatDateForInput(attendance.date)
                    };
                    this.attendanceForm.patchValue(formattedAttendance);
                },
                error: () => this.snackBar.open('Failed to load attendance record', 'Close', { duration: 3000 })
            });
        }
    }

    onSubmit(): void {
        if (this.attendanceForm.valid) {
            const formValues = this.attendanceForm.value;
            const attendance = {
                ...formValues,
                date: new Date(formValues.date),
            };
            
            const operation = this.isEditMode ?
                this.attendanceService.updateAttendance(this.attendanceId!, attendance) :
                this.attendanceService.createAttendance(attendance);

            operation.subscribe({
                next: () => {
                    this.snackBar.open('Attendance saved successfully', 'Close', { duration: 3000 });
                    this.router.navigate(['/attendance']);
                },
                error: () => this.snackBar.open('Failed to save attendance', 'Close', { duration: 3000 })
            });
        }
    }

    private formatDateForInput(date: Date | string): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }
}