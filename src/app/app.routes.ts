//app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { AttendanceListComponent } from './components/attendance-list/attendance-list.component';
import { AttendanceFormComponent } from './components/attendance-form/attendance-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/attendance', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'attendance',
    canActivate: [authGuard],
    children: [
      { path: '', component: AttendanceListComponent },
      { path: 'new', component: AttendanceFormComponent },
      { path: ':id/edit', component: AttendanceFormComponent }
    ]
  }
];