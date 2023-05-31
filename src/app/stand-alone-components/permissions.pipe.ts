import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permissions',
  standalone: true
})
export class PermissionsPipe implements PipeTransform {
  transform(gateName: string, permissionType: string): boolean {
    const allPermissions = JSON.parse(localStorage.getItem('permissions') as any);
    const can_access = allPermissions.some((permission: any) =>  permission?.gate_name === gateName && permission[permissionType] === 1);
    return can_access;
  }
}
