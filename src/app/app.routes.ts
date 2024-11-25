import { Routes } from '@angular/router';
import { GradeListComponent } from './components/grade-list/grade-list.component';
import { GradeFormComponent } from './components/grade-form/grade-form.component';

export const routes: Routes = [
    { path: 'grades', component: GradeListComponent },
    { path: 'grades/new', component: GradeFormComponent },
    { path: 'grades/:id/edit', component: GradeFormComponent },
    { path: '', redirectTo: '/grades', pathMatch: 'full' }
];