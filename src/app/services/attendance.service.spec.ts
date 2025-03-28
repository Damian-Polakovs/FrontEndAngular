import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Create a properly decorated service for testing
@Injectable({
  providedIn: 'root'
})
class AttendanceService {
  private apiUrl = 'http://localhost:3000/api/attendance';

  constructor(private http: HttpClient) {}

  getAttendances() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createBulkAttendance(data: any) {
    return this.http.post<any>(`${this.apiUrl}/bulk`, data);
  }

  getOverallAttendance() {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
}

describe('AttendanceService', () => {
  let service: AttendanceService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/attendance';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AttendanceService]
    });
    service = TestBed.inject(AttendanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all attendances', () => {
    const mockAttendances = [
      { _id: '1', class_id: 101, date: '2025-03-26', records: [] },
      { _id: '2', class_id: 102, date: '2025-03-26', records: [] }
    ];

    service.getAttendances().subscribe((attendances: any[]) => {
      expect(attendances.length).toBe(2);
      expect(attendances).toEqual(mockAttendances);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockAttendances);
  });

  it('should create bulk attendance records', () => {
    const mockAttendanceData = {
      class_id: 101,
      date: '2025-03-26',
      records: [
        { student_id: 1, status: 'present', notes: '' },
        { student_id: 2, status: 'absent', notes: 'Sick' }
      ]
    };

    const mockResponse = {
      success: true,
      message: 'Attendance records created successfully',
      data: { ...mockAttendanceData, _id: '123' }
    };

    service.createBulkAttendance(mockAttendanceData).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/bulk`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAttendanceData);
    req.flush(mockResponse);
  });

  it('should handle errors when creating attendance', () => {
    const mockAttendanceData = {
      class_id: 101,
      date: '2025-03-26',
      records: []
    };

    const mockError = { status: 500, statusText: 'Server Error' };

    service.createBulkAttendance(mockAttendanceData).subscribe({
      next: () => fail('Expected an error, not success'),
      error: (error: any) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/bulk`);
    expect(req.request.method).toBe('POST');
    req.flush('Internal Server Error', mockError);
  });
});
