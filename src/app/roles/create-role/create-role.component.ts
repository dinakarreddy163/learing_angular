import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils.service';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
})
export class CreateRoleComponent {
  createRoleForm!: FormGroup;
  permissionGroups: any;

  constructor(
    private fb: FormBuilder,
    private utlisService: UtilsService,
    private router: Router,
    private rolesService: RolesService
  ) {
    this.buildForm();
  }

  buildForm() {
    this.createRoleForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(60)]],
    });
  }

  createRole(formValue: any, permissions: any) {
    this.rolesService
      .createOrUpdateRole({ ...formValue, ...permissions })
      .subscribe((res: any) => {
        if (res.success) {
          this.utlisService.showSuccessToast(res.message);
          this.router.navigate(['roles']);
        } else {
          this.utlisService.showErrorToast(res.message);
        }
      });
  }
}
