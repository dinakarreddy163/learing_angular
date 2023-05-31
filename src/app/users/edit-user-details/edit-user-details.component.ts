import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/utils.service';
import { User } from '../users';
import { UsersService } from '../users.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { UserDetailsDataService } from './user-details-data.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.scss'],
})
export class EditUserDetailsComponent {
  @HostListener('window:beforeunload', ['$event']) onReload(event: any) {
    return '';
  }
  dialogRef: any;
  userId!: number | string | null;
  user!: User;

  constructor(
    private utlisService: UtilsService,
    private dialog: MatDialog,
    private router: Router,
    private userservice: UsersService,
    private userDetailsDataService: UserDetailsDataService,
    private route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.route.data.subscribe(({ user }) => {
      // set user data in store ...
      this.userDetailsDataService.UserDetails = user.result;
    });
  }

  resetUserDetails() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirm-dialog',
        width: '450px',
        maxWidth: '500px',
        disableClose: true,
        hasBackdrop: false,
        data: {
          headerText: 'Discard Changes',
          icon: 'info',
          color: 'warn',
          message: `Are you sure you want to discard these changes?`,
        },
      });
      this.dialogRef.afterClosed().subscribe((isConfirmed: any) => {
        if (isConfirmed) {
          // Call Update User
          this.userDetailsDataService.setInitialUserInfo();
        }
        this.dialogRef = null;
      });
    }
  }

  updateUserDetails() {
    this.router.navigate(['users/edit', this.userId]);
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirm-dialog',
        width: '500px',
        maxWidth: '500px',
        disableClose: true,
        hasBackdrop: false,
        data: {
          headerText: 'Confirm changes',
          icon: 'info',
          color: 'primary',
          message: `Are you sure you want to save these changes?`,
        },
      });
      this.dialogRef.afterClosed().subscribe((isConfirmed: any) => {
        if (isConfirmed) {
          const accountInfoChanges = this.getUpdatedUserDetailsFields(
            this.userDetailsDataService.accountInfo
          );
          const personalInfoChanges = this.getUpdatedUserDetailsFields(
            this.userDetailsDataService.personalInfo
          );
          const updatedUserDetails = {
            ...accountInfoChanges,
            ...personalInfoChanges,
          };
          this.userservice
            .editUser(this.userId, updatedUserDetails)
            .subscribe((res: any) => {
              if (res.success) {
                this.utlisService.showSuccessToast(res.message);
                this.router.navigate(['/users', this.userId]);
              } else {
                this.utlisService.showErrorToast(res.message);
              }
            });
        }
        this.dialogRef = null;
      });
    }
  }

  getUpdatedUserDetailsFields(UpdatedObject: any) {
    let updatedUserInfo: any = {};
    if (this.userDetailsDataService.passwordInfo.password) {
      updatedUserInfo['password'] =
        this.userDetailsDataService.passwordInfo.password;
    }
    Object.entries(this.userDetailsDataService.UserDetails).forEach((entry) => {
      const [key, value] = entry;
      if (
        key === 'status' &&
        UpdatedObject[key] !== value &&
        UpdatedObject[key] === 0
      ) {
        updatedUserInfo[key] = UpdatedObject[key];
      } else if (UpdatedObject[key] && UpdatedObject[key] !== value) {
        updatedUserInfo[key] = UpdatedObject[key];
      }
    });
    return updatedUserInfo;
  }
}
