import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';
import { LoginComponent } from './components/login/login.component';
import { AttendanceFormComponent } from './components/attendance-form/attendance-form.component';
import { EditAttendanceComponent } from './components/edit-attendance/edit-attendance.component';
import { AdminAttendanceComponent } from './components/admin-attendance/admin-attendance.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/attendance', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'attendance', component: AttendanceFormComponent, canActivate: [authGuard] },
  { path: 'attendance/edit', component: EditAttendanceComponent, canActivate: [authGuard] },
  { path: 'admin/attendance', component: AdminAttendanceComponent, canActivate: [authGuard, adminGuard] },
  { path: 'student/:id', component: StudentDetailComponent, canActivate: [authGuard] }
];