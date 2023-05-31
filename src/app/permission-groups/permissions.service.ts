import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '../utils.service';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  getPermissionGroups() {
    return this.http.get<any>(`${this.url}/permissions-groups`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  createOrUpdateNameAndDescription(
    nameAndDescriptionForm: any,
    isGroup: boolean,
    id: number | string | null,
    permissionGroupId?: number | null
  ) {
    const apiToCall = isGroup ? `permission-group` : `permission`;
    const actionToPerform = id ? `edit/${id}` : 'create';
    const body = isGroup
      ? nameAndDescriptionForm
      : { permission_group_id: permissionGroupId, ...nameAndDescriptionForm };
    return this.http
      .post<any>(`${this.url}/${apiToCall}/${actionToPerform}`, body)
      .pipe(catchError(this.utilsService.handleError));
  }

  getPermissionGroupById(id: number | string | null) {
    return this.http.get<any>(`${this.url}/permission-group/${id}`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  deletePermissionGroupById(id: number | string | null) {
    return this.http.get<any>(`${this.url}/permission-group/delete/${id}`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  getPermissions() {
    return this.http.get<any>(`${this.url}/permissions`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }

  deletePermissionById(id: number | string | null) {
    return this.http.get<any>(`${this.url}/permission/delete/${id}`)
    .pipe(
      catchError(this.utilsService.handleError)
    );
  }
}
