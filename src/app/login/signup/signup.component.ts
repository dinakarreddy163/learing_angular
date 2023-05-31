import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { UtilsService } from '../../utils.service';
import { noWhitespaceValidator } from '../../validators/white-space-validator';
import { passwordMatchingValidatior } from '../../validators/confirm-password.validator';
import { patterns } from '../../validators/pattern-validatorts';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login.component.scss']
})
export class SignupComponent implements OnInit {
  isShowPassword = false;
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private utlisService: UtilsService
  ) {}

  ngOnInit() {
    this.signUpForm = this.fb.group(
      {
        first_name: [
          '',
          [
            Validators.required,
            Validators.pattern(patterns.alphabetical_pattern),
            noWhitespaceValidator,
          ],
        ],
        last_name: [
          '',
          [
            Validators.required,
            Validators.pattern(patterns.alphabetical_pattern),
            noWhitespaceValidator,
          ],
        ],
        email: ['', [Validators.pattern(patterns.email_pattern)]],
        phone_number: [
          '',
          [
            Validators.required,
            Validators.pattern(patterns.mobile_number_pattern),
            noWhitespaceValidator,
          ],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.pattern(patterns.alpha_numeric_special_chars_pattern),
            noWhitespaceValidator,
          ],
        ],
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
        t_c_agreement: [false, [Validators.requiredTrue]],
      },
      { validators: passwordMatchingValidatior }
    );
  }

  onSubmit() {
    const {
      confirm_password,
      t_c_agreement,
      ...signUpFormWithoutConfirmPassword
    } = this.signUpForm.value;
    this.loginService
      .signUp(signUpFormWithoutConfirmPassword)
      .subscribe((res: any) => {
        if (res.success) {
          this.utlisService.showSuccessToast(`${res?.message}`);
          this.router.navigate(['/login']);
        } else {
          this.utlisService.showErrorToast(`${res?.message}`);
        }
      });
  }
}
