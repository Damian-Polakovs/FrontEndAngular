import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

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
    return this.auth0.user$.pipe(
      tap(user => console.log('Auth0 User Object:', JSON.stringify(user, null, 2))),
      catchError(error => {
        console.error('Error getting user:', error);
        return of(null);
      })
    );
  }

  //For debugging
  private getRoles(user: any): string[] {
    if (!user) return [];
    
    console.log('Checking roles for user:', user.email);
    
    //Hardcoded admin check for specific email
    if (user.email === 'admin@atu.ie' || user.email === 'damianpolakovs2004@gmail.com') {
      console.log('HARDCODED ADMIN MATCH for admin email');
      return ['admin'];
    }
    
    //Check if the email domain is from a teacher
    if (user.email && user.email.endsWith('@atu.ie')) {
      console.log('Teacher email domain detected for:', user.email);
      return ['teacher'];
    }
    
    //Check various possible locations for roles
    const possibleRoleFields = [
      'roles',
      'role',
      'app_metadata.roles',
      'user_metadata.roles'
    ];
    
    for (const field of possibleRoleFields) {
      const value = this.getNestedProperty(user, field);
      if (Array.isArray(value) && value.length > 0) {
        console.log(`Found roles in field ${field}:`, value);
        return value;
      } else if (typeof value === 'string') {
        console.log(`Found role in field ${field}:`, value);
        return [value];
      }
    }
    
    console.log('No roles found in user object');
    return [];
  }
  
  private getNestedProperty(obj: any, path: string): any {
    if (!obj) return undefined;
    
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    
    return current;
  }

  isAdmin(): Observable<boolean> {
    return this.auth0.user$.pipe(
      tap(user => console.log('Checking admin role for user:', user?.email)),
      map(user => {
        if (!user) {
          console.log('No user found');
          return false;
        }
        
        const roles = this.getRoles(user);
        const isAdmin = roles.includes('admin');
        console.log('Is admin?', isAdmin);
        return isAdmin;
      }),
      catchError(error => {
        console.error('Error checking admin role:', error);
        return of(false);
      })
    );
  }

  isTeacher(): Observable<boolean> {
    return this.auth0.user$.pipe(
      tap(user => console.log('Checking teacher role for user:', user?.email)),
      map(user => {
        if (!user) {
          console.log('No user found');
          return false;
        }
        
        const roles = this.getRoles(user);
        const isTeacher = roles.includes('teacher');
        console.log('Is teacher?', isTeacher);
        return isTeacher;
      }),
      catchError(error => {
        console.error('Error checking teacher role:', error);
        return of(false);
      })
    );
  }
}