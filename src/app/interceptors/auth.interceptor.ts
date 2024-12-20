import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    headers: req.headers.delete('Authorization') 
  });

  return next(authReq).pipe(
    catchError(error => {
      console.error('Auth Interceptor Error:', error);
      return throwError(() => error);
    })
  );
};
