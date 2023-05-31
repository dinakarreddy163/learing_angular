import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/utils.service';
import { UsersService } from '../../users.service';

import { patterns } from '../../../validators/pattern-validatorts';
import { noWhitespaceValidator } from 'src/app/validators/white-space-validator';
import { UserDetailsDataService } from '../user-details-data.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { User } from '../../users';
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: [
    './personal-info.component.scss',
    '../edit-user-details.component.scss',
  ],
})
export class PersonalInfoComponent {
  userId!: string | null | undefined;
  user!: User;
  userPersonalInfo!: any;
  personalInfoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private utlisService: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private userDetailsDataService: UserDetailsDataService
  ) {
    this.buildForm();
    this.userPersonalInfo = this.userDetailsDataService.personalInfo;
    this.setFormValues();
    this.userDetailsDataService.restoreDefaultSunject.subscribe((reset) => {
      if (reset) {
        this.userPersonalInfo = this.userDetailsDataService.personalInfo;
        this.setFormValues();
      }
    });
    this.onRouteChange();
  }

  onRouteChange() {
    this.router.events.subscribe((routeEvent) => {
      if (routeEvent instanceof NavigationEnd) {
        this.userDetailsDataService.personalInfo = this.personalInfoForm.value;
      }
    });
  }

  buildForm() {
    this.personalInfoForm = this.fb.group({
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
    });
  }

  setFormValues() {
    this.personalInfoForm.patchValue({
      first_name: this.userPersonalInfo.first_name,
      last_name: this.userPersonalInfo.last_name,
      email: this.userPersonalInfo.email,
      phone_number: this.userPersonalInfo.phone_number,
    });
  }
}
