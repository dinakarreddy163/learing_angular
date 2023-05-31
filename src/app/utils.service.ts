import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {HotToastService} from '@ngneat/hot-toast';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { User } from './users/users';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  dialogRef!: any;
  private url = environment.apiUrl;
  constructor(private toast: HotToastService, private http: HttpClient, private dialog: MatDialog) { }

  /**
   * Opens success toast using HotToastService .success method
   * @param message
   */
  showSuccessToast(message: string): void {
    this.toast.success(message, {
      duration: 2000,
      style: {
        border: '1px solid #27AE60',
        padding: '16px',
        color: '#27AE60',
      },
      iconTheme: {
        primary: '#27AE60',
      },
    });
  }

  /**
   * Opens error toast using HotToastService .error method
   * @param message
   */
  showErrorToast(message: string) {
    this.toast.error(message, {
      duration: 3000,
      style: {
        border: '1px solid #EB5757',
        padding: '16px',
        color: '#EB5757',
      },
      iconTheme: {
        primary: '#EB5757',
        secondary: '#FFFAEE',
      },
    });
  }

  openConfirmDialog(dialogData: any) {
      this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirm-dialog',
        width: '450px',
        maxWidth: '500px',
        disableClose: true,
        hasBackdrop: false,
        data: dialogData
      });
      return this.dialogRef;
  }
  /**
   * Sets UserInfo in LocalStorage for all app components to use
   */
  getUserInfo() {
    this.http.post<any>(`${this.url}/user/me`, {})
    .pipe(
      catchError(this.handleError)
    ).subscribe({
      next:(res) => {
        if (res.success && res.result) {
          // this.showSuccessToast(res?.message);
          localStorage.setItem('role_name', res?.result?.role?.name || "");
          localStorage.setItem("permissions", JSON.stringify(res?.result?.role?.permissions || []));
        }
      },
      error:(error) => {
        this.showErrorToast(error.message);
      }
    });
  }

  /**
   *
   * @returns -  All GATES Defined for Routes
   */
   getAPIGates() {
    this.http.get<any>(`${this.url}/gates`)
    .pipe(
      catchError(this.handleError)
    ).subscribe({
      next:(res) => {
        // console.log(res);
      },
      error:(error) => {}
    });
  }

  /**
   * Called when loggingIn user - sets the data of loggedIn user to be used persistent and used across the app -
   * @param user {User}
   */
  setUserData(user: any) {
    localStorage.setItem('api_token', user?.api_token);
    localStorage.setItem('id', user?.id);
    localStorage.setItem('first_name', user?.first_name);
    localStorage.setItem('last_name', user?.last_name);
    localStorage.setItem('phone_number', user?.phone_number);
    localStorage.setItem('email', user?.email);
    localStorage.setItem('role_id', user?.role_id?.toString());
    localStorage.setItem('role_name', user?.role?.name || "");
    localStorage.setItem("permissions", JSON.stringify(user?.role?.permissions || []));
  }

  /**
   * Called when loggingOut user - removes data from localStorage
   */
  removeUserData() {
    localStorage.removeItem('api_token');
    localStorage.removeItem('id');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('email');
    localStorage.removeItem('role_id');
    localStorage.removeItem('role_name');
    localStorage.removeItem('permissions');
  }

  /**
   *
   * @param firstName - User Firstname
   * @param lastName - User Lastname
   * @returns {string} - String constructed using first letters of firstName & lastName of user
   */
  profileName (firstName: string | null, lastName: string | null): string | null {
    return `${firstName?.slice(0,1)}${lastName?.slice(0,1)}`;
  }

  /**
   *
   * @param error -
   * @returns - Error Exception to be handled
   */
  handleError(error: HttpErrorResponse) {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    }
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
