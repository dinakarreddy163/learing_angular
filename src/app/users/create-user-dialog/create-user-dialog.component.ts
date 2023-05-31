import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../../validators/white-space-validator';
import { passwordMatchingValidatior } from '../../validators/confirm-password.validator';
import { patterns } from '../../validators/pattern-validatorts';
import { UsersService } from '../users.service';
import { UtilsService } from 'src/app/utils.service';
import { RolesService } from 'src/app/roles/roles.service';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss'],
})
export class CreateUserDialogComponent {
  isShowPassword = false;
  isUserNameAvailable!: boolean;
  UserNameAvailableText!: string;
  statuses = [
    {
      label: 'Pending',
      value: null,
    },
    {
      label: 'Active',
      value: 1,
    },
    {
      label: 'Inactive',
      value: 0
    }];
  roles: any = [];
  createUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private utlisService: UtilsService,
    private rolesService: RolesService,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getAllRoles();
    this.buildForm();
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

  buildForm() {
    this.createUserForm = this.fb.group(
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
        role_id: ['', [Validators.required]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
            Validators.pattern(patterns.alpha_numeric_special_chars_pattern),
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
        status: [1],
      },
      { validators: passwordMatchingValidatior }
    );
  }

  checkUserNameAvailability(event: any) {
    if (!this.createUserForm.get('username')?.errors) {
      this.userService
        .isUsernameAvailable(event?.target?.value.trim())
        .subscribe((res: any) => {
          this.isUserNameAvailable = res.success;
          this.UserNameAvailableText = res.message;
        });
    }
  }

  onSubmit() {
    const { confirm_password, ...createFormToSend } = this.createUserForm.value;
    if (!this.createUserForm.get('status')?.value) {
      delete createFormToSend.status;
    }
    this.userService.createUser(createFormToSend).subscribe((res: any) => {
      if (res.success) {
        this.utlisService.showSuccessToast(`${res?.message}`);
        this.close(true);
      } else {
        this.utlisService.showErrorToast(`${res?.message}`);
      }
    });
  }

  close(isSuccess: boolean): void {
    this.dialogRef.close(isSuccess);
  }
}
