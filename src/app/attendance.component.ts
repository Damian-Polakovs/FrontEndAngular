//attendance.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-attendance',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet]
})
export class AttendanceComponent {}