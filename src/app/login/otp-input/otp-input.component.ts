import { Component, HostListener, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../utils.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'lps-admin-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss', '../login.component.scss']
})
export class OtpInputComponent {
  title = 'otp';
  timeToResend: any;
  enableResend = false;
  form!: FormGroup;
  maskedPhoneNumber: string | null;
  onlyNumberValidator = /[0-9]$/;
  formInput = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];
  @ViewChildren('formRow') rows: any;

  @HostListener('keypress', ['$event']) onInputChange(event: KeyboardEvent) {
    return event.key && this.onlyNumberValidator.test(event.key);
  }
  @HostListener('paste', ['$event']) onPaste(event: any) {
    this.handlePaste(event);
  }

  constructor(
    private utlisService: UtilsService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.maskedPhoneNumber = this.route.snapshot.paramMap.get('phoneNumber');
    this.form = this.toFormGroup(this.formInput);
    this.timer(1);
  }

  // Creates formgroup of six input formcontrols
  toFormGroup(elements: any[]) {
    const group: any = {};

    elements.forEach((key: string | number) => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  // Changes focus of input after number is entered/removed
  moveToNext(event: any, index: number) {
    let pos = index;
    if (this.onlyNumberValidator.test(event.key) || event.key === 'Backspace') {
      if (event.keyCode === 8 && event.which === 8) {
        pos = index - 1;
      } else {
        pos = index + 1;
      }
      if (pos > -1 && pos < this.formInput.length) {
        this.rows._results[pos].nativeElement.focus();
      }
    }
  }

  handlePaste = (ev: any) => {
    const clip = ev.clipboardData.getData('text'); // Get clipboard data
    const otp = clip.replace(/\s/g, ''); // Sanitize string
    if (otp.length === 6) {
      const number = [...otp]; // Create array of numbers
      this.form.patchValue({
        otp1: number[0] as number,
        otp2: number[1] as number,
        otp3: number[2] as number,
        otp4: number[3] as number,
        otp5: number[4] as number,
        otp6: number[5] as number,
      }); // Populate inputs
      this.rows._results[otp.length - 1].nativeElement.focus(); // Focus input
    }
    return false;
  };

  onSubmit() {
    const serializedOTP = Object.values(this.form.value).join('').toString();
    if(this.form.valid) {
    this.loginService.VerifyOTP(serializedOTP).subscribe((res: any) => {
      if (res.success && res.result?.data?.api_token) {
        this.utlisService.showSuccessToast(res?.message);
        this.utlisService.setUserData(res.result?.data);
        this.router.navigate(['/home']);
      } else {
        this.utlisService.showErrorToast(res?.message);
      }
    });
   }
  }

  // Timer to enable resend OTP after given minutes
  timer(minute: number) {
    // let minute = 1;
    this.enableResend = false;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.timeToResend = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.enableResend = true;
        clearInterval(timer);
      }
    }, 1000);
  }

  resendOTP() {
    this.timer(1);
    this.loginService.resendOTP().subscribe((res: any) => {
      if (res.success && res.result?.token) {
        this.utlisService.showSuccessToast(res?.message);
        localStorage.setItem('token', res.result.token);
      } else {
        this.utlisService.showErrorToast(res?.message);
      }
    });
  }
}
