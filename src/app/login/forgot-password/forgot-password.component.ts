import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { UtilsService } from '../../utils.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  userForm!: FormGroup;
  successMsg!: string;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private utlisService: UtilsService
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
    });
  }

  onSubmit() {
    this.loginService
      .forgotPassword(this.userForm.value)
      .subscribe((res: any) => {
        console.log(res);
        if (res.success && res.result.is_email_sent) {
          this.utlisService.showSuccessToast(res?.message);
          this.successMsg = res?.message;
        } else {
          this.utlisService.showErrorToast(res?.message);
        }
      });
  }
}
