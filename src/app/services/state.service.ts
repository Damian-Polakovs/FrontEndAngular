import { Injectable, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export interface Student {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface ClassAttendance {
  class_id: string;
  date: string;
  records: AttendanceRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Signal for students
  private _students = signal<Student[]>([]);
  public students = this._students.asReadonly();
  public studentsObservable = toObservable(this.students);
  
  // Signal for current class
  private _currentClassId = signal<string | null>(null);
  public currentClassId = this._currentClassId.asReadonly();
  
  // Signal for attendance records
  private _attendanceRecords = signal<ClassAttendance[]>([]);
  public attendanceRecords = this._attendanceRecords.asReadonly();
  
  // Computed signal for filtered attendance records by class
  public currentClassAttendance = computed(() => {
    const classId = this._currentClassId();
    if (classId === null) return [];
    
    return this._attendanceRecords()
      .filter(record => record.class_id === classId);
  });
  
  constructor() {}
  
  // Methods to update state
  setStudents(students: Student[]) {
    this._students.set(students);
  }
  
  setCurrentClass(classId: string) {
    this._currentClassId.set(classId);
  }
  
  addAttendanceRecord(record: ClassAttendance) {
    this._attendanceRecords.update(records => [...records, record]);
  }
  
  updateAttendanceRecord(updatedRecord: ClassAttendance) {
    this._attendanceRecords.update(records => 
      records.map(record => 
        record.class_id === updatedRecord.class_id && record.date === updatedRecord.date
          ? updatedRecord
          : record
      )
    );
  }
  
  clearAttendanceRecords() {
    this._attendanceRecords.set([]);
  }
}
