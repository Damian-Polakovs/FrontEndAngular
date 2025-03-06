import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <button mat-raised-button color="primary" (click)="login()">
        Login with Auth0
      </button>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      text-align: center;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.auth.loginWithRedirect({
      appState: { target: '/attendance' }
    });
  }
}
