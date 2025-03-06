import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  displayedColumns = ['date', 'class', 'status', 'comments'];
  studentData: any = { id: '', name: '' };
  attendanceHistory: any[] = [];
  totalClasses = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    const studentId = this.route.snapshot.params['id'];
    this.loadStudentData(studentId);
  }

  loadStudentData(studentId: string) {
    this.studentService.getStudentDetails(studentId).subscribe({
      next: (data) => {
        this.studentData = data;
        this.loadAttendanceHistory(studentId);
      },
      error: (error) => {
        console.error('Error loading student details:', error);
      }
    });
  }

  loadAttendanceHistory(studentId: string) {
    this.studentService.getStudentAttendance(studentId).subscribe({
      next: (data) => {
        this.attendanceHistory = data;
        this.totalClasses = this.attendanceHistory.length;
      },
      error: (error) => {
        console.error('Error loading attendance history:', error);
      }
    });
  }

  calculatePercentage(status: string): number {
    if (!this.totalClasses) return 0;
    if (status === 'Present') {
      // For Present percentage, include both Present and Late
      const presentCount = this.getAttendanceCount('Present');
      const lateCount = this.getAttendanceCount('Late');
      return Math.round(((presentCount + lateCount) / this.totalClasses) * 100);
    }
    const count = this.getAttendanceCount(status);
    return Math.round((count / this.totalClasses) * 100);
  }

  getAttendanceCount(status: string): number {
    return this.attendanceHistory.filter(record => record.status === status).length;
  }

  goBack() {
    this.router.navigate(['/attendance']);
  }
}