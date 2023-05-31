import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { UtilsService } from '../utils.service';
@Component({
  selector: 'lps-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LogInComponent implements OnInit {
  isShowPassword = false;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private utlisService: UtilsService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false, Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.signIn(this.loginForm.value).subscribe((res: any) => {
        if (res.success && res.result.token) {
          this.utlisService.showSuccessToast(res?.message);
          localStorage.setItem('token', res.result.token);
          this.router.navigate(['/login/two-step-verification',{phoneNumber: res.result.phone_number_masked}]);
        } else if(res.success && res.result.data?.api_token) {
          this.utlisService.showSuccessToast(res?.message);
          this.utlisService.setUserData(res.result.data);
          this.router.navigate(['/home']);
        } else {
          this.utlisService.showErrorToast(res?.message);
        }
      });
    }
  }
}
