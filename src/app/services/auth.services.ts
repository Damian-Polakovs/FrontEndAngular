import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth0: Auth0Service,
    private router: Router
  ) {}

  loginWithRedirect(options?: any): void {
    this.auth0.loginWithRedirect(options);
  }

  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  getToken(): Observable<string | null> {
    return this.auth0.getAccessTokenSilently();
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  getUser(): Observable<any> {
    return this.auth0.user$;
  }

  isAdmin(): Observable<boolean> {
    return this.auth0.user$.pipe(
      map(user => user?.['https://my-app.com/roles']?.includes('admin') ?? false)
    );
  }
}