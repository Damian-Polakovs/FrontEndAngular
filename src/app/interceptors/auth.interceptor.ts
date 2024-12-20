import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { mergeMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return auth.getToken().pipe(
    mergeMap(token => {
      if (token) {
        const authReq = req.clone({
          headers: req.headers
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
        });
        return next(authReq);
      }
      return next(req);
    }),
    catchError(error => {
      console.error('Auth Interceptor Error:', error);
      return throwError(() => error);
    })
  );
};