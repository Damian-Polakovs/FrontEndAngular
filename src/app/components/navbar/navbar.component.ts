import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ]
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  isTeacher = false;
  userEmail = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      
      if (isAuthenticated) {
        //Get user info
        this.authService.getUser().subscribe(user => {
          this.userEmail = user?.email || '';
        });
        
        //Check roles
        this.authService.isAdmin().subscribe(isAdmin => {
          this.isAdmin = isAdmin;
          console.log('Is admin in navbar:', isAdmin);
        });
        
        this.authService.isTeacher().subscribe(isTeacher => {
          this.isTeacher = isTeacher;
          console.log('Is teacher in navbar:', isTeacher);
        });
      }
    });
  }

  login(): void {
    this.authService.loginWithRedirect();
  }

  logout(): void {
    this.authService.logout();
  }

  goToAttendance(): void {
    //Always navigate to the main attendance page
    this.router.navigate(['/attendance']);
  }

  goToAdminDashboard(): void {
    this.router.navigate(['/admin/attendance']);
  }
}
