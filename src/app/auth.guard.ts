import { inject } from '@angular/core';
import { Router, type CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService as CustomAuthService } from './services/auth.services';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth0 = inject(AuthService);
  const authService = inject(CustomAuthService);
  const router = inject(Router);

  console.log('Auth guard activated, checking if user is authenticated');

  return auth0.isAuthenticated$.pipe(
    switchMap(isAuthenticated => {
      console.log('User authenticated:', isAuthenticated);
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        router.navigate(['/login']);
        return of(false);
      }
      
      //Check if user is admin and redirect accordingly
      return authService.isAdmin().pipe(
        tap(isAdmin => {
          console.log('User is admin:', isAdmin);
          // Only redirect if we're on the root or attendance page
          if (isAdmin && (state.url === '/' || state.url === '/attendance')) {
            console.log('Admin user detected, redirecting to admin page');
            router.navigate(['/admin/attendance']);
          }
        }),
        catchError(error => {
          console.error('Error checking admin role in auth guard:', error);
          return of(false);
        }),
        map(() => true) //Allow access regardless of admin status
      );
    })
  );
};