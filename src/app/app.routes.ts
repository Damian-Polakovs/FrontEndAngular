import { Routes } from '@angular/router';
import { AttendanceListComponent } from './components/attendance-list/attendance-list.component';
import { AttendanceFormComponent } from './components/attendance-form/attendance-form.component';

export const routes: Routes = [
    { path: 'grades', component: AttendanceListComponent },
    { path: 'grades/new', component: AttendanceFormComponent },
    { path: 'grades/:id/edit', component: AttendanceFormComponent },
    { path: '', redirectTo: '/grades', pathMatch: 'full' }
];