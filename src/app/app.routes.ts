import { Routes } from '@angular/router';
import { AttendanceListComponent } from './components/attendance-list/attendance-list.component';
import { AttendanceFormComponent } from './components/attendance-form/attendance-form.component';

export const routes: Routes = [
    { path: 'attendance', component: AttendanceListComponent },
    { path: 'attendance/new', component: AttendanceFormComponent },
    { path: 'attendance/:id/edit', component: AttendanceFormComponent },
    { path: '', redirectTo: '/attendance', pathMatch: 'full' }
];