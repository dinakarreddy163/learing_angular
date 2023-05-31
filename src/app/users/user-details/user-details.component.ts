import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/utils.service';
import { User } from '../users';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements AfterViewInit {
  userId!: number | string | null;
  dialogRef: any;
  user!: User;
  loggedInUserId = Number(localStorage.getItem('id'));
  constructor(
    private utlisService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private userservice: UsersService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getUserDetails(this.userId);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getUserDetails(id: string | number | null) {
    this.userservice.getUser(id)
    .subscribe((res: any) => {
      this.user = res.result;
    })

  }

  get profileName() {
    return this.utlisService.profileName(
      this.user?.first_name,
      this.user?.last_name
    );
  }

  updateStatus(id: number, status: number) {
    this.userservice.updateStatus(id, status).subscribe((res: any) => {
      if (res.success) {
        this.utlisService.showSuccessToast(res.message);
        this.getUserDetails(this.userId)
      } else {
        this.utlisService.showErrorToast(res.message);
      }
    });
  }

  deleteUser() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirm-dialog',
        width: '450px',
        maxWidth: '500px',
        disableClose: true,
        hasBackdrop: false,
        data: {
          headerText: 'Confirm Delete',
          icon: 'delete_forever',
          color: 'warn',
          message: `Are you sure you want to delete
        @${this.user.username} from the users?`,
        },
      });
      this.dialogRef.afterClosed().subscribe((isConfirmed: any) => {
        if (isConfirmed) {
          this.userservice.deleteUser(this.user.id).subscribe((res: any) => {
            if (res.success) {
              this.utlisService.showSuccessToast(res.message);
              this.router.navigate(['/users']);
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
