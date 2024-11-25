import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeService } from '../../services/grade.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-grade-form',
    templateUrl: './grade-form.component.html',
    styleUrls: ['./grade-form.component.css'],
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
export class GradeFormComponent implements OnInit {
    gradeForm: FormGroup;
    isEditMode = false;
    gradeId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private gradeService: GradeService,
        private snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.gradeForm = this.fb.group({
            student_id: ['', [Validators.required, Validators.min(1)]],
            class_id: ['', [Validators.required, Validators.min(1)]],
            score: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            type: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.gradeId = this.route.snapshot.paramMap.get('id');
        if (this.gradeId) {
            this.isEditMode = true;
            this.loadGrade();
        }
    }

    loadGrade(): void {
        if (this.gradeId) {
            this.gradeService.getGrade(this.gradeId).subscribe({
                next: (grade) => this.gradeForm.patchValue(grade),
                error: () => this.snackBar.open('Failed to load grade', 'Close', { duration: 3000 })
            });
        }
    }

    onSubmit(): void {
        if (this.gradeForm.valid) {
            const grade = this.gradeForm.value;
            const operation = this.isEditMode ?
                this.gradeService.updateGrade(this.gradeId!, grade) :
                this.gradeService.createGrade(grade);

            operation.subscribe({
                next: () => {
                    this.snackBar.open('Grade saved successfully', 'Close', { duration: 3000 });
                    this.router.navigate(['/grades']);
                },
                error: () => this.snackBar.open('Failed to save grade', 'Close', { duration: 3000 })
            });
        }
    }
}