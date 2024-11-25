import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { GradeFormComponent } from './components/grade-form/grade-form.component';
import { GradeListComponent } from './components/grade-list/grade-list.component';

@NgModule({
    declarations: [
        AppComponent,
        GradeFormComponent,
        GradeListComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot([
            { path: 'grades', component: GradeListComponent },
            { path: 'grades/new', component: GradeFormComponent },
            { path: 'grades/:id/edit', component: GradeFormComponent },
            { path: '', redirectTo: '/grades', pathMatch: 'full' }
        ]),
        MatTableModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatToolbarModule
    ],
    providers: [], 
    bootstrap: [AppComponent]
})
export class AppModule { }