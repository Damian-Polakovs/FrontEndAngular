import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EditAttendanceComponent } from '../edit-attendance/edit-attendance.component';
import { AdminAttendanceComponent } from '../admin-attendance/admin-attendance.component';
import { AttendanceFormComponent } from '../attendance-form/attendance-form.component';

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatIconModule,
  MatTableModule,
  MatSnackBarModule
];

const formModules = [
  FormsModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [
    EditAttendanceComponent,
    AdminAttendanceComponent,
    AttendanceFormComponent
  ],
  imports: [
    CommonModule,
    ...formModules,
    ...materialModules
  ],
  exports: [
    EditAttendanceComponent,
    AdminAttendanceComponent,
    AttendanceFormComponent,
    ...formModules,
    ...materialModules
  ]
})
export class AttendanceModule { }
