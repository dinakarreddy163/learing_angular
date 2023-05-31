import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../users';
import { UserAccountInfo } from './account-info/user-account-info';
import { UserPersonalInfo } from './personal-info/user-personal-info';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsDataService {
  _user!: User;
  _accountInfo = {};
  _personalInfo = {};
  _passwordInfo = {};
  private restoreDefault$ = new Subject<boolean>();
  restoreDefaultSunject = this.restoreDefault$.asObservable();

  constructor() {}

  set UserDetails(user: User) {
    this._user = user;
    this.setInitialUserInfo();
  }

  setInitialUserInfo() {
    this.accountInfo = {
      id: this._user.id,
      username: this._user.username,
      role_id: this._user.role_id,
      status: this._user.status,
    };

    this.personalInfo = {
      first_name: this._user.first_name,
      last_name: this._user.last_name,
      email: this._user.email,
      phone_number: this._user.phone_number,
    };
    this.passwordInfo = {
      password: '',
    };
    this.restoreDefault$.next(true);
  }

  get UserDetails() {
    return this._user;
  }

  set accountInfo(accountInfo: any) {
    this._accountInfo = accountInfo;
  }

  get accountInfo() {
    return this._accountInfo;
  }

  set personalInfo(personalInfo: any) {
    this._personalInfo = personalInfo;
  }

  get personalInfo() {
    return this._personalInfo;
  }

  set passwordInfo(passwordInfo: any) {
    this._passwordInfo = passwordInfo;
  }

  get passwordInfo() {
    return this._passwordInfo;
  }
}
