import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UtilsService } from '../utils.service';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
   private url = environment.apiUrl;
  constructor(private http: HttpClient, private utilsService:UtilsService) { }

  signIn(loginForm: any) {
    return this.http
      .post<any>(`${this.url}/sign-in`, loginForm)
      .pipe(catchError(this.utilsService.handleError));
  }

  signUp(signUpForm: any) {
    return this.http
      .post<any>(`${this.url}/sign-up`, signUpForm)
      .pipe(catchError(this.utilsService.handleError));
  }

  forgotPassword(userName: string) {
    return this.http
      .post<any>(`${this.url}/forget-password`, userName)
      .pipe(catchError(this.utilsService.handleError));
  }

  VerifyOTP(code: string) {
    const token = localStorage.getItem('token');
    const body = {
      token: token,
      code: code,
    };
    return this.http
      .post<any>(`${this.url}/otp-check`, body)
      .pipe(catchError(this.utilsService.handleError));
  }

  resendOTP() {
    const token = localStorage.getItem('token');
    const body = {
      old_token: token,
    };
    return this.http
      .post<any>(`${this.url}/resend-otp`, body)
      .pipe(catchError(this.utilsService.handleError));
  }

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  hasToken() : boolean {
    return !!localStorage.getItem('api_token');
  }
}
