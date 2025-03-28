import { inject } from '@angular/core';
import { Router, type CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.services';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('Admin guard activated, checking if user is admin');
  
  return auth.isAdmin().pipe(
    tap(isAdmin => {
      console.log('Admin guard result:', isAdmin);
      if (!isAdmin) {
        console.log('User is not admin, redirecting to attendance page');
        router.navigate(['/attendance']);
      } else {
        console.log('User is admin, allowing access to admin page');
      }
    }),
    catchError(error => {
      console.error('Error in admin guard:', error);
      router.navigate(['/attendance']);
      return of(false);
    }),
    map(isAdmin => isAdmin)
  );
};
