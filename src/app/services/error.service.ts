//error.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse) {
    let message = 'An error occurred';
    
    if (error.status === 0) {
      message = 'Server is not available. Please try again later.';
    } else if (error.status === 401) {
      message = 'You are not authorized. Please log in.';
    } else if (error.error?.message) {
      message = error.error.message;
    }

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

    return throwError(() => error);
  }
}