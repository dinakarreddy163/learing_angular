import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs/operators';
import { RolesService } from '../roles.service';
import { User } from 'src/app/users/users';
import { UtilsService } from 'src/app/utils.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-add-user-dialog',
    templateUrl: './add-user-dialog.component.html',
    styleUrls: ['./add-user-dialog.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, NgIf, ReactiveFormsModule, MatFormFieldModule, MatChipsModule, NgFor]
})
export class AddUserDialogComponent {
  addUserForm!: FormGroup;
  usersList: User[] = [];
  users: User[] = [];
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  constructor(
    private fb: FormBuilder,
    public utlisService: UtilsService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private rolesService: RolesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.addUserForm = this.fb.group({
      username: [null, Validators.required],
    });
    this.username.valueChanges
      .pipe(startWith(null), debounceTime(300))
      .subscribe((user: string | null) => {
        if (user && user.length >= 3) {
          this.getUsers(user);
        } else {
          this.usersList = [];
        }
      });
  }

  getUsers(userSearchTerm: string) {
    this.rolesService
      .serachUsersForRole(this.data.roleId, userSearchTerm.trim().toLowerCase())
      .subscribe((res: any) => {
        if (res.success) {
          this.usersList = res.result;
        } else {
          this.usersList = [];
        }
      });
  }

  get username() {
    return this.addUserForm?.get('username') as FormControl;
  }

  profileName(user: User) {
    return this.utlisService.profileName(user?.first_name, user?.last_name);
  }

  remove(userToRemove: User): void {
    const index = this.users.findIndex(
      (user) => user.user_id === userToRemove.user_id
    );

    if (index >= 0) {
      const removedUser = this.users.splice(index, 1);
      this.usersList.push(removedUser[0]);
    }
  }

  addUser(userAdded: User): void {
    this.users.push(userAdded);
    this.userInput.nativeElement.value = '';
    this.userInput.nativeElement.focus();
    this.username.setValue('');
    const indexToRemove = this.usersList.findIndex(
      (user) => user.user_id === userAdded.user_id
    );
    if (indexToRemove >= 0) {
      this.usersList.splice(indexToRemove, 1);
    }
  }

  clear() {
    this.username.setValue(null);
    this.users = [];
    this.usersList = [];
  }

  addUsersToRole() {
    const userIdsToAdd = this.users.map((user) => String(user.user_id));
    this.rolesService
      .assignUsersToRole(this.data.roleId, userIdsToAdd)
      .subscribe((res: any) => {
        if (res.success) {
          this.utlisService.showSuccessToast(res.message);
          this.close(res);
        } else {
          this.utlisService.showErrorToast(res.message);
        }
      });
  }

  close(res: any): void {
    this.dialogRef.close(res);
  }
}
