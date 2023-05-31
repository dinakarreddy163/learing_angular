import { Route } from '@angular/router';
import { PermissionGroupsComponent } from './permission-groups.component';
import { PermissionGroupDetailsComponent } from './permission-group-details/permission-group-details.component';
import { PermissionsCheckGuard } from '../guards/permission-check.guard';

export const PERMISSION_ROUTES: Route[] = [
  {
    path: '',
    component: PermissionGroupsComponent,
  },
  {
    path: 'permission-group-details',
    component: PermissionGroupDetailsComponent,
    canActivate: [PermissionsCheckGuard],
    data: {
      permission: { gateName: 'permissions', permissionType: 'can_read' },
    },
  },
];
