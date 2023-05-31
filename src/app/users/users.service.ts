import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UtilsService } from '../utils.service';
import { catchError, retry } from 'rxjs/operators';
import { User } from './users';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient, private utilsService:UtilsService) { }

  getUsers(search = "", sort_by = 'id', order_by = 'asc', pageNumber = 0, pageSize = 10, statuses: string[], roles: any[]) :  Observable<User[]> {

    let params = new HttpParams();
    const offset = pageNumber + 1;
    if (search) {
      params = params.append('search', search);
    }
    if(statuses && statuses.length > 0) {
      params = params.append('status', statuses.toString());
    }
    if(roles && roles.length > 0) {
      const roleIds = roles.map(({ id }) => id);
      params = params.append('role_ids', JSON.stringify(roleIds));
    }
    params = params.append('sort_by', sort_by);
    params = params.append('order_by', order_by);
    params = params.append('offset', offset.toString());
    params = params.append('limit', pageSize.toString());

    return this.http.get<any>(`${this.url}/users`, {params: params})
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  isUsernameAvailable(username: string) {
    let params = new HttpParams();
    params = params.append('username', username);
    return this.http.get<any>(`${this.url}/validate-username`, {params: params})
    .pipe(
      catchError(this.utilsService.handleError)
    );;
  }

  createUser(createUserForm: any) {
    return this.http
      .post<any>(`${this.url}/user/create`, createUserForm)
      .pipe(catchError(this.utilsService.handleError));
  }

  getUser(userId: string | number | null | undefined) {
    return this.http.get<any>(`${this.url}/user/${userId}`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  editUser(userId: number | string | null, editUserForm: any) {
    return this.http
      .post<any>(`${this.url}/user/edit/${userId}`, editUserForm)
      .pipe(catchError(this.utilsService.handleError));
  }

  deleteUser(userId: number) {
    return this.http.get<any>(`${this.url}/user/delete/${userId}`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  updateStatus(userId: number | string | null, status: number) {
    const body = {
      user_id: userId,
      status: status
    }
    return this.http.post<any>(`${this.url}/user/statusUpdate`, body)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }
  /**
   *
   * @param search - filter data by searchTerm
   * @param sort_by - columnName to sort/order by
   * @param order_by - Direction 'asc' or 'desc'
   * @param pageNumber - current pageIndex
   * @param pageSize - curent page/rows set on table
   * @returns - LoginHistory Observable Data to subscribe to
   */
  getLoginHistory(search = "", sort_by = 'id', order_by = 'desc', pageNumber = 0, pageSize = 10) {

    let params = new HttpParams();
    const page = pageNumber + 1;
    if (search) {
      params = params.append('search', search);
    }
    params = params.append('sort_by', sort_by);
    params = params.append('order_by', order_by);
    params = params.append('page', page.toString());
    params = params.append('limit', pageSize.toString());
    return this.http.get<any>(`${this.url}/login-history`, {params})
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }
}
