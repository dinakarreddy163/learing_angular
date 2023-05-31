import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../stand-alone-components/table/TableColumn';
import { UtilsService } from '../utils.service';
import { RolesService } from './roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent {
  dialogRef: any;
  roles: any;
  rolesTableColumns: TableColumn[] = [];
  rowActionIcons = [
    {
      name: 'edit',
      icon: 'edit',
      permissionType: 'can_write'
    },
    {
      name: 'delete',
      icon: 'delete',
      permissionType: 'can_delete'
    },
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private utlisService: UtilsService,
    private rolesService: RolesService
  ) {
    this.getRoles();
    this.initColumns();
  }

  getRoles(): any {
    this.rolesService.getRoles().subscribe((res: any) => {
      if (res.success) {
        this.roles = res.result;
      } else {
        this.utlisService.showErrorToast(res.message);
      }
    });
  }

  initColumns() {
    this.rolesTableColumns = [
      {
        name: 'Role',
        dataKey: 'name',
        position: 'left',
        isSortable: false,
        textColor: 'text-secondary',
      },
      {
        name: 'Description',
        dataKey: 'description',
        position: 'left',
        isSortable: false,
        textColor: 'text-300',
      },
      {
        name: 'Users',
        dataKey: 'user_count',
        position: 'left',
        isSortable: false,
        textColor: 'text-300',
      },
    ];
  }

  onAction(actionEvent: any) {
    switch (actionEvent.actionName) {
      case 'edit':
        this.router.navigate(['roles/manage-role', { id: actionEvent.row.id }]);
        break;

      case 'delete':
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
              this.rolesService
                .deleteRole(actionEvent.row.id)
                .subscribe((res: any) => {
                  if (res.success) {
                    this.utlisService.showSuccessToast(res.message);
                    this.getRoles();
                  } else {
                    this.utlisService.showErrorToast(res.message);
                  }
                });
            }
            this.dialogRef = null;
          });
        }
        break;

      default:
        break;
    }
  }
}
