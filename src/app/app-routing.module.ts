import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AnonymousGuard } from './guards/anonymous.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { ErrorComponent } from './error/error.component';
import { PermissionsCheckGuard } from './guards/permission-check.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(comp => comp.HomeComponent),
      },
      {
        path: 'users',
        canActivate: [PermissionsCheckGuard],
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        data: { permission: {gateName: 'user', permissionType: 'can_read'}}
      },
      {
        path: 'roles',
        canActivate: [PermissionsCheckGuard],
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
        data: { permission: {gateName: 'roles', permissionType: 'can_read'}}
      },
      {
        path: 'permission-groups',
        canActivate: [PermissionsCheckGuard],
        loadChildren: () => import('./permission-groups/permissions-routing.module').then(mod => mod.PERMISSION_ROUTES),
        data: { permission: {gateName: 'permissions', permissionType: 'can_read'}}
      },
    ],
  },
  {
    path: '',
    canActivate: [AnonymousGuard],
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(mod => mod.LoginModule),
      }
    ]
  },
  {
    path: 'error/:id',
    component: ErrorComponent,
  },
  {
    path: '**',
    redirectTo: 'error/404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
