import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../utils.service';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  createOrUpdateRole(createRoleForm: any) {
    return this.http
      .post<any>(`${this.url}/role/createOrUpdateRole`, createRoleForm)
      .pipe(catchError(this.utilsService.handleError));
  }

  getRoles() {
    return this.http.get<any>(`${this.url}/roles`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  getRoleById(roleId: number | string | null) {
    return this.http.get<any>(`${this.url}/role/${roleId}`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  getUsersByRoleId(roleId: number | string | null) {
    return this.http.get<any>(`${this.url}/role-users/${roleId}`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  serachUsersForRole(roleId: number | string | null, search: string) {
    const body = {
      role_id: roleId,
      search_input: search,
    };
    return this.http
      .post<any>(`${this.url}/role/user-search`, body)
      .pipe(catchError(this.utilsService.handleError));
  }

  assignUsersToRole(roleId: number | string | null, users: string[]) {
    const body = {
      role_id: roleId,
      user_ids: users,
    };
    return this.http
      .post<any>(`${this.url}/role/assign-user`, body)
      .pipe(catchError(this.utilsService.handleError));
  }

  unAssignUserFromRole(users: string[], roleId?: number | string | null) {
    const body = {
      role_id: roleId,
      user_ids: users,
    };
    return this.http
      .post<any>(`${this.url}/role/unassign-user`, body)
      .pipe(catchError(this.utilsService.handleError));
  }

  deleteRole(roleId: number | string | null) {
    return this.http.get<any>(`${this.url}/role/delete/${roleId}`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }
}
