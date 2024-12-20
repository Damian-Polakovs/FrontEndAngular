import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //Check if user is already authenticated
    this.auth.isAuthenticated().subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/attendance']);
        }
      }
    );
  }

  async login(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      await this.auth.login();
    } catch (error) {
      this.error = 'Failed to log in. Please try again.';
      this.snackBar.open(this.error, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    } finally {
      this.isLoading = false;
    }
  }
}