import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.services';
import { tap } from 'rxjs/operators';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  return auth.isAuthenticated().pipe(
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
      }
    })
  );
};