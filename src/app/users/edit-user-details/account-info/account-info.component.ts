import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RolesService } from 'src/app/roles/roles.service';
import { UtilsService } from 'src/app/utils.service';
import { User } from '../../users';
import { UsersService } from '../../users.service';
import { UserDetailsDataService } from '../user-details-data.service';
@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: [
    './account-info.component.scss',
    '../edit-user-details.component.scss',
  ],
})
export class AccountInfoComponent {
  userId: string | number | null = Number(localStorage.getItem('id'));
  user!: User;
  userAccountInfo!: any;
  accountInfoForm!: FormGroup;
  roles: any = [];
  statuses = [
    // {
    //   label: 'Pending',
    //   value: null
    // },
    {
      label: 'Active',
      value: 1,
    },
    {
      label: 'Inactive',
      value: 0,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private utlisService: UtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private userDetailsDataService: UserDetailsDataService,
  ) {
    if(this.roles.length === 0) this.getAllRoles();
    this.buildForm();
    this.userAccountInfo = this.userDetailsDataService.accountInfo;
    this.setFormValues();
    this.userDetailsDataService.restoreDefaultSunject.subscribe((reset) => {
      if (reset) {
        this.userAccountInfo = this.userDetailsDataService.accountInfo;
        this.setFormValues();
      }
    });
    this.onRouteChange();
  }

  getAllRoles(): any {
    this.rolesService.getRoles()
    .subscribe((res: any) => {
      if(res.success) {
        this.roles = res.result;
      } else {
        this.utlisService.showErrorToast(res.message);
      }
    });
  }

  onRouteChange() {
    this.router.events.subscribe((routeEvent) => {
      if (routeEvent instanceof NavigationEnd) {
        this.userDetailsDataService.accountInfo =
          this.accountInfoForm.getRawValue();
      }
    });
  }

  buildForm() {
    this.accountInfoForm = this.fb.group({
      id: [''],
      username: [{value: '', disabled: true}],
      role_id: ['', [Validators.required]],
      status: [''],
    });
  }

  setFormValues() {
    this.accountInfoForm.patchValue({
      id: this.userAccountInfo.id,
      username: this.userAccountInfo.username,
      role_id: this.userAccountInfo.role_id,
      status: this.userAccountInfo.status,
    });
    if(this.userId === this.userAccountInfo.id) {
      this.accountInfoForm.get('role_id')?.disable();
      this.accountInfoForm.get('status')?.disable();
    }
  }
}
