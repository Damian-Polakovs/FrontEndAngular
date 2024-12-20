import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.services';
import { LoginComponent } from './login/login.component';
import { AttendanceListComponent } from './components/attendance-list/attendance-list.component';
import { AttendanceFormComponent } from './components/attendance-form/attendance-form.component';
import { AttendanceComponent } from './attendance.component';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { 
        path: 'attendance', 
        component: AttendanceComponent,
        canActivate: [() => inject(AuthService).isAuthenticated()],
        children: [
          { path: '', component: AttendanceListComponent },
          { path: 'new', component: AttendanceFormComponent },
          { path: ':id/edit', component: AttendanceFormComponent }
        ]
      }
    ]),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    {
      provide: 'Window',
      useValue: window
    },
    importProvidersFrom(
      AuthModule.forRoot({
        domain: environment.auth0.domain,
        clientId: environment.auth0.clientId,
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: `https://${environment.auth0.domain}/api/v2/`,
          scope: 'openid profile email'
        }
      })
    )
  ]
};