import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PermissionsService } from 'src/app/permission-groups/permissions.service';
import { PermissionElement, GroupBy } from './permissions-models';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
  editSliderToggleForm!: FormGroup;
  @Input() isUpdate: boolean = false;
  @Input() permissionData: any;
  @Output() updatedPermissions = new EventEmitter<any>();
  displayedColumns: string[] = ['name', 'can_read', 'can_write', 'can_delete'];
  dataSource: any;

  constructor(
    private fb: FormBuilder,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit() {
    if (this.isUpdate) {
      this.editSliderToggleForm = this.fb.group({
        enableEdit: '',
      });
      this.dataSource = this.serializePermissionGroupForTable(
        this.permissionData
      );
    } else {
      this.permissionsService.getPermissionGroups().subscribe((res: any) => {
        if (res.success) {
          this.dataSource = this.serializePermissionGroupForTable(res.result);
        }
      });
    }
  }

  get enableEdit() {
    return this.editSliderToggleForm.get('enableEdit')?.value;
  }
  isGroup(index: any, item: { isGroupBy: boolean }): boolean {
    return item.isGroupBy;
  }

  serializePermissionGroupForTable(permissionGroups: any) {
    let elementData: (PermissionElement | GroupBy)[] = [];
    permissionGroups.map((permissionGroup: any) => {
      const permissionGroupHeaderRow: GroupBy = {
        name: permissionGroup.name,
        isGroupBy: true,
        permission_group_id: permissionGroup.id,
      };
      elementData.push(permissionGroupHeaderRow);
      permissionGroup.permissions.map((permission: any) => {
        const permissionRow: PermissionElement = {
          name: permission.name,
          permission_group_id: permissionGroup.id,
          permission_id: permission.id,
          permission_access_id: permission?.permission_access?.id
            ? permission?.permission_access?.id
            : null,
          can_read: permission?.permission_access
            ? permission.permission_access.can_read
            : false,
          can_write: permission?.permission_access
            ? permission.permission_access.can_write
            : false,
          can_delete: permission?.permission_access
            ? permission.permission_access.can_delete
            : false,
        };
        elementData.push(permissionRow);
      });
    });
    return elementData;
  }

  filterByGroupId(id: number) {
    return this.dataSource.filter(
      (element: any) => element.permission_group_id === id
    );
  }

  /** Whether All the Columns for given group is selected */
  isAllSelected(id: number) {
    const groupRows = this.dataSource.filter(
      (element: any) => element.permission_group_id === id && !element.isGroupBy
    );
    const AreAllPermissionsSelected =
      groupRows.length > 0 &&
      groupRows.every(
        (row: any) => row.can_read && row.can_write && row.can_delete
      );
    return AreAllPermissionsSelected;
  }

  /** Whether Some the Columns for given group is selected */
  isPartiallySelected(groupByRow: any) {
    const groupRows = this.dataSource.filter(
      (element: any) =>
        element.permission_group_id === groupByRow.permission_group_id &&
        !element.isGroupBy
    );
    const AreSomeRowsSelected = groupRows.some(
      (row: any) => row.can_read || row.can_write || row.can_delete
    );
    return (
      AreSomeRowsSelected && !this.isAllSelected(groupByRow.permission_group_id)
    );
  }

  /** Selects all rows & columns if they are not all selected; otherwise clear selection. */
  toggleAllGroupRows(id: number) {
    if (this.isAllSelected(id)) {
      this.filterByGroupId(id).forEach((row: any) => {
        row.can_read = false;
        row.can_write = false;
        row.can_delete = false;
      });
      return;
    }
    this.filterByGroupId(id).forEach((row: any) => {
      row.can_read = true;
      row.can_write = true;
      row.can_delete = true;
    });
  }

  /** Toggle individual permission and check if All permissions are selected */
  toggleColumn(event: MatCheckboxChange, element: any, key: string) {
    element[key] = event.checked;
    if((key === 'can_write' || key === 'can_delete') && event.checked) element['can_read'] = true;
    this.isAllSelected(element.permission_group_id);
  }

  updatePermissions() {
    this.updatedPermissions.emit(this.getPermissionsWithoutGroupHeaader());
  }

  /**
   *
   * @returns permissions array object without groupHeader elements
   */
  getPermissionsWithoutGroupHeaader() {
    return {
      permissions: this.dataSource.filter(
        (permission: { isGroupBy: boolean }) => !permission.isGroupBy
      ),
    };
  }
}
