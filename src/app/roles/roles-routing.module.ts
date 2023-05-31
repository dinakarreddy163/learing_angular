import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsCheckGuard } from '../guards/permission-check.guard';
import { CreateRoleComponent } from './create-role/create-role.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { RolesComponent } from './roles.component';

const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
  },
  {
    path: 'create-role',
    canActivate: [ PermissionsCheckGuard],
    data: { permission: {gateName: 'roles', permissionType: 'can_write'}},
    component: CreateRoleComponent
  },
  {
    path: 'manage-role',
    canActivate: [ PermissionsCheckGuard],
    data: { permission: {gateName: 'roles', permissionType: 'can_write'}},
    component: ManageRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
