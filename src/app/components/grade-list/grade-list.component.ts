import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GradeService } from '../../services/grade.service';
import { Grade } from '../../models/grade';

@Component({
    selector: 'app-grade-list',
    templateUrl: './grade-list.component.html',
    styleUrls: ['./grade-list.component.css']
})
export class GradeListComponent implements OnInit {
    grades: Grade[] = [];
    displayedColumns: string[] = ['student_id', 'class_id', 'type', 'score', 'actions'];

    constructor(
        private gradeService: GradeService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadGrades();
    }

    loadGrades(): void {
        this.gradeService.getGrades().subscribe({
            next: (grades) => this.grades = grades,
            error: () => this.snackBar.open('Failed to load grades', 'Close', { duration: 3000 })
        });
    }

    deleteGrade(id: string): void {
        if (confirm('Are you sure you want to delete this grade?')) {
            this.gradeService.deleteGrade(id).subscribe({
                next: () => {
                    this.loadGrades();
                    this.snackBar.open('Grade deleted successfully', 'Close', { duration: 3000 });
                },
                error: () => this.snackBar.open('Failed to delete grade', 'Close', { duration: 3000 })
            });
        }
    }
}