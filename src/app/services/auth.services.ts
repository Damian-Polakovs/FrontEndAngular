import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  
  constructor(private auth0: Auth0Service) {
    // Check if user is authenticated on service init
    this.checkAuth();
  }

  private checkAuth(): void {
    this.auth0.user$.subscribe(
      user => this.userSubject.next(user)
    );
  }

  login(): void {
    this.auth0.loginWithRedirect();
  }

  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  handleRedirectCallback(): Observable<any> {
    return this.auth0.handleRedirectCallback();
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getToken(): Observable<string> {
    return this.auth0.getAccessTokenSilently();
  }
}