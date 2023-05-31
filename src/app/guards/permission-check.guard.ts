import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { UtilsService } from '../utils.service';

/**
 * If User has permission to access the route
 * @param route
 * @returns {boolean}
 */
export const PermissionsCheckGuard = (route: ActivatedRouteSnapshot): boolean => {
  const router = inject(Router);
  const utilsService = inject(UtilsService);
  const allPermissions = JSON.parse(localStorage.getItem('permissions') as any);
  const canPass = allPermissions.some((permission: any) =>  permission?.gate_name === route.data['permission'].gateName && permission[route.data['permission'].permissionType] === 1);
  if (canPass) return true;
  utilsService.showErrorToast(
    `Oops!! You don't seem to have permission to aceess this route. You can reach out to your admin about it.`
  );
  router.navigate(['/home']);
  return false;
};
