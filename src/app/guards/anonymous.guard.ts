import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

/**
 * If User is already loggedIn and trying to access LoginLayout routes
 * @returns {boolean}
 */
export const AnonymousGuard = (): boolean => {
  const router = inject(Router);
  const isLoggedIn = inject(LoginService).hasToken();
  if(isLoggedIn) {
    router.navigate(['/home']);
    return false;
  }
  return true;
}
