import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private utlisService: UtilsService) {}

  private handleAuthError(error: HttpErrorResponse) {
    this.utlisService.showErrorToast(error.error.message);
    this.utlisService.removeUserData();
    this.router.navigate(['/login']);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('api_token');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next.handle(request).pipe(
      tap(
        {
          next: () => {},
          error: (err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401 || err.status === 403) {
                this.handleAuthError(err);
              } else if(err.status === 500 || err.status === 502 || err.status === 503) {
                this.router.navigate(['error', 500]);
              }
              return;
            }
          },
        }
      )
    );
  }
}
