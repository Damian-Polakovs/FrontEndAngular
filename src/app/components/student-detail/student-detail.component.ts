import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../../services/student.service';
import { StateService } from '../../services/state.service';
import { ClassAttendance } from '../../services/state.service';

interface StudentAttendanceRecord {
  date: string;
  class_id: string;
  class: string;
  status: string;
  comments: string;
}

interface StudentData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  displayedColumns = ['date', 'class', 'status', 'comments'];
  studentData: StudentData = { id: '', name: '' };
  attendanceHistory: StudentAttendanceRecord[] = [];
  totalClasses = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private stateService: StateService
  ) {}

  ngOnInit() {
    const studentId = this.route.snapshot.params['id'];
    this.loadStudentData(studentId);
  }

  loadStudentData(studentId: string) {
    this.studentService.getStudentDetails(studentId).subscribe({
      next: (data: StudentData) => {
        this.studentData = data;
        this.loadAttendanceHistory(studentId);
      },
      error: (error: any) => {
        console.error('Error loading student details:', error);
      }
    });
  }

  loadAttendanceHistory(studentId: string) {
    //Check if we have attendance data in the state service
    const stateAttendance = this.stateService.attendanceRecords();
    if (stateAttendance && stateAttendance.length > 0) {
      //Process attendance records from state service
      const studentAttendance: StudentAttendanceRecord[] = [];
      
      stateAttendance.forEach((classAttendance: ClassAttendance) => {
        //Find this student's record in each class attendance
        const studentRecord = classAttendance.records.find(record => record.student_id === studentId);
        
        if (studentRecord) {
          //This student was in this class
          studentAttendance.push({
            date: classAttendance.date,
            class_id: classAttendance.class_id,
            class: this.getClassNameById(classAttendance.class_id),
            status: studentRecord.status,
            comments: studentRecord.notes || ''
          });
        }
      });
      
      this.attendanceHistory = studentAttendance;
      this.totalClasses = this.attendanceHistory.length;
    } else {
      //Fallback to mock data if no state data is available
      this.studentService.getStudentAttendance(studentId).subscribe({
        next: (data: any[]) => {
          //Filter the mock data to only include classes for this student based on the pattern in the admin component
          const studentClasses = this.getStudentClasses(studentId);
          this.attendanceHistory = data.filter((record: any) => 
            studentClasses.includes(record.class_id)
          );
          this.totalClasses = this.attendanceHistory.length;
        },
        error: (error: any) => {
          console.error('Error loading attendance history:', error);
        }
      });
    }
  }

  getStudentClasses(studentId: string): string[] {
    //This mimics the logic from the admin component to determine which classes a student attends
    const studentClassMap: Record<string, string[]> = {
      'S00212345': ['OSD-L-SD'],
      'S00234567': ['OSD-L-SD'],
      'S00245678': ['OSD-L-C'],
      'S00256789': ['OSD-L-C'],
      'S00267890': ['OSD-T-SD'],
      'S00278901': ['OSD-T-SD'],
      'S00289012': ['OSD-T-C'],
      'S00290123': ['OSD-T-C']
    };
    
    return studentClassMap[studentId] || [];
  }

  getClassNameById(classId: string): string {
    const classMap: Record<string, string> = {
      'OSD-L-SD': 'Open Stack Development Lecture (Software Development)',
      'OSD-L-C': 'Open Stack Development Lecture (Computing)',
      'OSD-T-SD': 'Open Stack Development Tutorial (Software Development)',
      'OSD-T-C': 'Open Stack Development Tutorial (Computing)'
    };
    
    return classMap[classId] || classId;
  }

  calculatePercentage(status: string): number {
    if (this.totalClasses === 0) return 0;
    
    const count = this.getAttendanceCount(status);
    return Math.round((count / this.totalClasses) * 100);
  }

  getAttendanceCount(status: string): number {
    return this.attendanceHistory.filter(record => record.status === status).length;
  }

  goBack() {
    //Check if we came from admin page or attendance page
    const referrer = document.referrer;
    if (referrer.includes('admin')) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/attendance']);
    }
  }
}