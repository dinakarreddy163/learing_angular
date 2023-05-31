import { inject, Injectable } from '@angular/core';
import { Router, } from '@angular/router';
import { LoginService } from '../login/login.service';

/**
 * If User is not loggedIn and trying to access HomeLayout routes
 * @returns {boolean}
 */
export const AuthGuard = (): boolean => {
  const router = inject(Router);
  const isLoggedIn = inject(LoginService).hasToken();
  if(isLoggedIn) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
