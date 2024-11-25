import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GradeService } from '../../services/grade.service';
import { Grade } from '../../models/grade';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-grade-list',
    templateUrl: './grade-list.component.html',
    styleUrls: ['./grade-list.component.css'],
    standalone: true,
    imports: [
        MatTableModule, 
        MatButtonModule, 
        MatIconModule, 
        RouterLink,
        CommonModule
    ]
})
export class GradeListComponent implements OnInit {
    dataSource = new MatTableDataSource<Grade>([]);
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
            next: (grades) => {
                const mappedGrades = grades.map(grade => ({
                    _id: grade._id,
                    student_id: grade.student_id,
                    class_id: grade.class_id,
                    score: grade.scores[0].score,
                    type: grade.scores[0].type
                }));
                this.dataSource.data = mappedGrades;
            },
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