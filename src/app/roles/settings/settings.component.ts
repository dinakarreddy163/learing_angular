import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../roles.service';
import { UtilsService } from 'src/app/utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  dialogRef: any;
  updateRoleForm!: FormGroup;
  @Input() roleName!: string | null;
  @Input() roleDesc!: string | null;
  @Input() roleId!: string | number | null;
  @Output() updatedRoleDetails = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private utlisService: UtilsService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.updateRoleForm = this.fb.group({
      name: [this.roleName, [Validators.required]],
      description: [
        this.roleDesc,
        [Validators.required, Validators.maxLength(60)],
      ],
    });
  }

  updateeRoleDetails() {
    this.updatedRoleDetails.emit(this.updateRoleForm.value);
  }

  deleteRole() {
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
          message: `Remove this role? This action cannot be undone.`,
        },
      });
      this.dialogRef.afterClosed().subscribe((isConfirmed: any) => {
        if (isConfirmed) {
          this.rolesService.deleteRole(this.roleId).subscribe((res: any) => {
            if (res.success) {
              this.utlisService.showSuccessToast(res.message);
              this.router.navigate(['roles']);
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
