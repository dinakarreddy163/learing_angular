import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/users/users';
import { UtilsService } from 'src/app/utils.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { RolesService } from '../roles.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  dialogRef: any;
  users!: User[];
  allUsers!: User[];
  @Input() roleId!: string | number | null;
  @Input() roleName!: string | null;

  constructor(
    private dialog: MatDialog,
    private utlisService: UtilsService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.rolesService.getUsersByRoleId(this.roleId).subscribe((res: any) => {
      if (res.success) {
        this.users = res.result;
        this.allUsers = res.result;
      } else {
        this.utlisService.showErrorToast(res.message);
      }
    });
  }

  profileName(user: User) {
    return this.utlisService.profileName(user?.first_name, user?.last_name);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.users = this.allUsers.filter(
      (user) => user.username.indexOf(filterValue) > -1
    );
  }

  addUser() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(AddUserDialogComponent, {
        panelClass: 'dialog',
        width: '500px',
        maxWidth: '600px',
        minHeight: '400px',
        disableClose: true,
        hasBackdrop: true,
        data: {
          roleId: this.roleId,
        },
      });
      this.dialogRef.afterClosed().subscribe((data: any) => {
        this.dialogRef = null;
        if (data) this.getUsers();
      });
    }
  }

  removeUser(id: any) {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirm-dialog',
        width: '470px',
        maxWidth: '500px',
        disableClose: true,
        hasBackdrop: false,
        data: {
          headerText: 'Confirm Delete',
          icon: 'delete_forever',
          color: 'warn',
          message: `Remove user from this role? This action cannot be undone.`,
        },
      });
      this.dialogRef.afterClosed().subscribe((isConfirmed: any) => {
        if (isConfirmed) {
          this.rolesService
            .unAssignUserFromRole([String(id)])
            .subscribe((res: any) => {
              if (res.success) {
                this.utlisService.showSuccessToast(res.message);
                this.getUsers();
              } else {
                this.utlisService.showErrorToast(res.message);
              }
            });
        }
        this.dialogRef = null;
      });
    }
  }
}
