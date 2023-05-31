import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchingValidatior } from '../../../validators/confirm-password.validator';
import { patterns } from '../../../validators/pattern-validatorts';
import { UtilsService } from 'src/app/utils.service';
import { UsersService } from '../../users.service';
import { noWhitespaceValidator } from 'src/app/validators/white-space-validator';
import { UserDetailsDataService } from '../user-details-data.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { User } from '../../users';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: [
    './password-change.component.scss',
    '../edit-user-details.component.scss',
  ],
})
export class PasswordChangeComponent {
  userId!: string | null | undefined;
  userPasswordInfo!: any;
  passwordChangeForm!: FormGroup;
  isShowPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private utlisService: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private userDetailsDataService: UserDetailsDataService
  ) {
    this.buildForm();
    this.userPasswordInfo = this.userDetailsDataService.passwordInfo;
    this.setFormValues();
    this.userDetailsDataService.restoreDefaultSunject.subscribe((reset) => {
      if (reset) {
        this.userPasswordInfo = this.userDetailsDataService.accountInfo;
        this.setFormValues();
      }
    });
    this.onRouteChange();
  }

  onRouteChange() {
    this.router.events.subscribe((routeEvent) => {
      if (routeEvent instanceof NavigationEnd) {
        if (this.passwordChangeForm.errors === null) {
          this.userDetailsDataService.passwordInfo =
            this.passwordChangeForm.value;
        }
      }
    });
  }

  buildForm() {
    this.passwordChangeForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(patterns.alpha_numeric_special_chars_pattern),
            noWhitespaceValidator,
          ],
        ],
        confirm_password: ['', [Validators.required]],
      },
      { validators: passwordMatchingValidatior }
    );
  }

  setFormValues() {
    this.passwordChangeForm.patchValue({
      password: this.userPasswordInfo.password,
      confirm_password: this.userPasswordInfo.password,
    });
  }
}
