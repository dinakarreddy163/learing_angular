import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ZeroDataComponent } from '../stand-alone-components/zero-data/zero-data.component';
import { TableColumn } from '../stand-alone-components/table/TableColumn';
import { UtilsService } from '../utils.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { formatDate } from '@angular/common';
import { PermissionsService } from './permissions.service';
import { TableComponent } from '../stand-alone-components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { NameAndDescriptionFormDialogComponent } from './name-description-form-dialog/name-description-form-dialog.component';
import { PermissionsPipe } from '../stand-alone-components/permissions.pipe';

@Component({
  selector: 'app-permission-groups',
  templateUrl: './permission-groups.component.html',
  styleUrls: ['./permission-groups.component.scss'],
  standalone: true,
  imports: [
    ZeroDataComponent,
    TableComponent,
    MatIconModule,
    MatButtonModule,
    RouterLinkActive,
    NameAndDescriptionFormDialogComponent,
    RouterLink,
    NgIf,
    PermissionsPipe
  ],
})
export class PermissionGroupsComponent {
  dialogRef: any;
  permissionGroups: any;
  permissionGroupsTableColumns: TableColumn[] = [];
  rowActionIcons = [
    {
      name: 'details',
      icon: 'visibility',
      permissionType: 'can_read'
    },
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
    private permissionsService: PermissionsService
  ) {
    this.getPermissionGroups();
    this.initColumns();
  }

  getPermissionGroups(): any {
    this.permissionsService.getPermissionGroups().subscribe((res: any) => {
      if (res.success) {
        this.permissionGroups = res.result;
        this.permissionGroups.forEach((permissionGroup: any) => {
          permissionGroup.created_at = formatDate(
            permissionGroup.created_at,
            'mediumDate',
            'en-IN'
          );
          permissionGroup.updated_at = formatDate(
            permissionGroup.updated_at,
            'mediumDate',
            'en-IN'
          );
        });
      } else {
        this.utlisService.showErrorToast(res.message);
      }
    });
  }

  initColumns() {
    this.permissionGroupsTableColumns = [
      {
        name: 'Name',
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
        name: 'Created',
        dataKey: 'created_at',
        position: 'left',
        isSortable: false,
        textColor: 'text-300',
      },
      {
        name: 'Modified',
        dataKey: 'updated_at',
        position: 'left',
        isSortable: false,
        textColor: 'text-300',
      },
    ];
  }

  onAction(actionEvent: any) {
    switch (actionEvent.actionName) {
      case 'details':
        this.router.navigate([
          'permission-groups/permission-group-details',
          { id: actionEvent.row.id },
        ]);
        break;

      case 'edit':
        const formValues = (({ name, id, description }) => ({
          name,
          id,
          description,
        }))(actionEvent.row);
        this.openNameAndDescriptionFormDialog(formValues);
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
              message: `Remove this permission-group? This action cannot be undone.`,
            },
          });
          this.dialogRef.afterClosed().subscribe((isConfirmed: any) => {
            if (isConfirmed) {
              this.permissionsService
                .deletePermissionGroupById(actionEvent.row.id)
                .subscribe((res: any) => {
                  if (res.success) {
                    this.utlisService.showSuccessToast(res.message);
                    this.getPermissionGroups();
                  } else {
                    this.utlisService.showSuccessToast(res.message);
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

  openNameAndDescriptionFormDialog(data?: any) {
    const dataForDialog = data
      ? { isUpdate: true, isPermissionGroup: true, ...data }
      : { isUpdate: false, isPermissionGroup: true };
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(NameAndDescriptionFormDialogComponent, {
        panelClass: 'dialog',
        width: '500px',
        maxWidth: '600px',
        minHeight: '400px',
        disableClose: true,
        hasBackdrop: true,
        data: dataForDialog,
      });
      this.dialogRef.afterClosed().subscribe((data: any) => {
        if (data) this.getPermissionGroups();
        this.dialogRef = null;
      });
    }
  }
}
