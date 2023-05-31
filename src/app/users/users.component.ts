import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { TableColumn } from '../stand-alone-components/table/TableColumn';
import { MatDialog } from '@angular/material/dialog';
import { User } from './users';
import { UsersService } from './users.service';
import { FormControl } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { UsersDataSource } from './users-datasource';
import { ActivatedRoute } from '@angular/router';
import { merge, tap } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UtilsService } from '../utils.service';
import { RolesService } from '../roles/roles.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  dialogRef: any;
  users!: User[];
  userId: string | number | null = Number(localStorage.getItem('id'));
  dataSource!: UsersDataSource;
  displayedColumns = [
    'id',
    'username',
    'email',
    'phone_number',
    'role_id',
    'created_at',
    'status',
    'action',
  ];
  appliedStatuses: FormControl = new FormControl('');
  appliedRoles: FormControl = new FormControl('');
  private paginator!: MatPaginator;
  private sort!: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
  }
  roles: any = [];
  statuses = ['Pending', 'Active', 'Inactive'];
  actions = [
    {
      name: 'details',
      icon: 'visibility',
      color: 'basic',
    },
    {
      name: 'delete',
      icon: 'delete',
      color: 'basic',
    },
  ];
  usersTableColumns!: TableColumn[];
  paginationSizes: number[] = [5, 10, 25, 50];
  defaultPageSize = this.paginationSizes[0];
  _users: any;
  search = '';

  constructor(
    private dialog: MatDialog,
    private userservice: UsersService,
    private utlisService: UtilsService,
    private route: ActivatedRoute,
    private rolesService: RolesService) {
      this.getAllRoles();
  }

  ngOnInit(): void {
    this.search = this.route.snapshot.data['search'];
    this.dataSource = new UsersDataSource(this.userservice);
    this.dataSource.loadUsers(this.search, 'id', 'asc', 0, this.defaultPageSize, this.appliedStatuses.value, this.appliedRoles.value);
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

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Rows per page:';
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadUsersPage()))
      .subscribe();
  }

  loadUsersPage() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.dataSource.loadUsers(
      this.search,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.appliedStatuses.value,
      this.appliedRoles.value);
  }

  applyFilter(event: Event) {
    this.paginator.pageIndex = 0;
    this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.search.length >= 3 || this.search === '') this.loadUsersPage();
  }

  filterByStatus(event: MatSelectChange) {
    this.paginator.pageIndex = 0;
    this.loadUsersPage();
  }

  filterByRole(event: MatSelectChange) {
    this.paginator.pageIndex = 0;
    this.loadUsersPage();
  }

  addUser() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(CreateUserDialogComponent, {
        panelClass: 'dialog-side-panel',
        width: '450px',
        maxWidth: '600px',
        disableClose: true,
        hasBackdrop: true,
        height: '100%',
        data: {},
      });
      this.dialogRef.afterClosed().subscribe((isSuccess: any) => {
        if (isSuccess) this.loadUsersPage();
        this.dialogRef = null;
      });
    }
  }

  deleteUser(user: User) {
    if(!this.dialogRef) {
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
        @${user.username} from the users?`
      }
    });
    this.dialogRef.afterClosed().subscribe((isConfirmed: any) => {
      if(isConfirmed) {
        this.userservice.deleteUser(user.id)
        .subscribe((res: any) => {
          if(res.success) {
            this.utlisService.showSuccessToast(res.message);
            this.paginator.pageIndex = 0;
            this.loadUsersPage();
          } else {
            this.utlisService.showErrorToast(res.message);
          }
        })
      }
      this.dialogRef = null;
    });
  }
  }

  clearFilters() {
    this.search = '';
    this.appliedRoles.setValue([]);
    this.appliedStatuses.setValue([]);
    this.paginator.pageIndex = 0;
    this.loadUsersPage();
  }

  removeRole(value: string) {
    this.appliedRoles.setValue(this.appliedRoles.value.filter((role: any) => role.id !== value));
    this.paginator.pageIndex = 0;
    this.loadUsersPage();
  }

  removeStatus(value: string) {
    this.appliedStatuses.setValue(
      this.appliedStatuses.value.filter((status: string) => status !== value)
    );
    this.paginator.pageIndex = 0;
    this.loadUsersPage();
  }
}
