import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate, NgIf } from '@angular/common';
import {
  Router,
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { UtilsService } from 'src/app/utils.service';
import { PermissionsService } from '../permissions.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from 'src/app/stand-alone-components/table/table.component';
import { TableColumn } from 'src/app/stand-alone-components/table/TableColumn';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NameAndDescriptionFormDialogComponent } from '../name-description-form-dialog/name-description-form-dialog.component';
import { ZeroDataComponent } from 'src/app/stand-alone-components/zero-data/zero-data.component';
import { PermissionsPipe } from 'src/app/stand-alone-components/permissions.pipe';

@Component({
  selector: 'app-permission-group-details',
  standalone: true,
  imports: [
    TableComponent,
    MatIconModule,
    MatButtonModule,
    ZeroDataComponent,
    NameAndDescriptionFormDialogComponent,
    RouterLinkActive,
    RouterLink,
    NgIf,
    PermissionsPipe
  ],
  templateUrl: './permission-group-details.component.html',
  styleUrls: ['./permission-group-details.component.scss'],
})
export class PermissionGroupDetailsComponent implements OnInit {
  dialogRef: any;
  permissionGroupName: string | null = '';
  permissionGroupDesc: string | null = '';
  permissionGroupId: string | number | null = '';
  permissions!: any;
  permissionsTableColumns: TableColumn[] = [];
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
    private utlisService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private permissionsService: PermissionsService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.permissionGroupId = params.get('id');
    });
  }

  ngOnInit() {
    this.getPermissionGroupDetails();
    this.initColumns();
  }

  getPermissionGroupDetails() {
    this.permissionsService
      .getPermissionGroupById(this.permissionGroupId)
      .subscribe((res: any) => {
        if (res.success) {
          this.permissionGroupName = res.result.name;
          this.permissionGroupDesc = res.result.description;
          this.permissions = res.result.permissions;
          this.permissions.forEach((permission: any) => {
            permission.created_at = formatDate(
              permission.created_at,
              'mediumDate',
              'en-IN'
            );
            permission.updated_at = formatDate(
              permission.updated_at,
              'mediumDate',
              'en-IN'
            );
          });
        }
      });
  }

  initColumns() {
    this.permissionsTableColumns = [
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
              message: `Remove this permission? This action cannot be undone.`,
            },
          });
          this.dialogRef.afterClosed().subscribe((isConfirmed: any) => {
            if (isConfirmed) {
              this.permissionsService
                .deletePermissionById(actionEvent.row.id)
                .subscribe((res: any) => {
                  if (res.success) {
                    this.utlisService.showSuccessToast(res.message);
                    this.getPermissionGroupDetails();
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
      ? {
          isUpdate: true,
          isPermissionGroup: false,
          permissionGroupId: this.permissionGroupId,
          ...data,
        }
      : {
          isUpdate: false,
          isPermissionGroup: false,
          permissionGroupId: this.permissionGroupId,
        };
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
        if (data) this.getPermissionGroupDetails();
        this.dialogRef = null;
      });
    }
  }
}
