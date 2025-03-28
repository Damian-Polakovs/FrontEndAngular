import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'grade-management-app';
  
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication and redirect based on role
    this.auth.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.auth.isAdmin().subscribe(isAdmin => {
          console.log('Is admin in app component:', isAdmin);
          if (isAdmin && (this.router.url === '/attendance' || this.router.url === '/')) {
            console.log('Redirecting admin to admin dashboard');
            this.router.navigate(['/admin/attendance']);
          }
        });
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
