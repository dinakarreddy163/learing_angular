import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { PermissionsCheckGuard } from '../guards/permission-check.guard';
import { AccountInfoComponent } from './edit-user-details/account-info/account-info.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';
import { PasswordChangeComponent } from './edit-user-details/password-change/password-change.component';
import { PersonalInfoComponent } from './edit-user-details/personal-info/personal-info.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';

export const userResolver: ResolveFn<any> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(UsersService).getUser(route.paramMap.get('id')!);
  };

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'login-history',
    component: LoginHistoryComponent,
    data: { permission: {gateName: 'login_history', permissionType: 'can_read'}}
  },
  {
    path: ':id',
    // canActivate: [ PermissionsCheckGuard],
    data: { permission: {gateName: 'user', permissionType: 'can_read'}},
    component: UserDetailsComponent
  },
  {
    path: 'edit/:id',
    component: EditUserDetailsComponent,
    // canActivate: [ PermissionsCheckGuard],
    data: { permission: {gateName: 'user', permissionType: 'can_write'}},
    resolve: {user: userResolver},
    children: [
      {
        path: 'account-info',
        component: AccountInfoComponent
      },
      {
        path: 'personal-info',
        component: PersonalInfoComponent
      },
      {
        path: 'password-change',
        component: PasswordChangeComponent
      },
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'account-info'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
