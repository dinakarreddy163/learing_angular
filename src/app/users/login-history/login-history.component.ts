import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableColumn } from 'src/app/stand-alone-components/table/TableColumn';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss']
})
export class LoginHistoryComponent implements OnInit {
  search = '';
  total!: number;
  loginHistory: any;
  loginHistoryTableColumns: TableColumn[] = [];
  rowActionIcons = [
    {
      name: 'details',
      icon: 'visibility',
      permissionType: 'can_read'
    }
  ];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getLoginHistory('',  'id', 'desc', 0, 10);
    this.initColumns();
  }

  getLoginHistory(search?: string, sort_by?: string, order_by?: string, pageNumber?: number, pageSize?: number) {
    this.usersService.getLoginHistory(search, sort_by, order_by, pageNumber, pageSize)
    .subscribe(res => {
      if(res.success) {
      this.total = res.result.count;
      this.loginHistory = res.result.data;
      this.loginHistory.forEach((userHistory: any) => {
        userHistory.created_at = formatDate(
          userHistory.created_at,
          'medium',
          'en-IN'
        );
        userHistory.updated_at = formatDate(
          userHistory.updated_at,
          'medium',
          'en-IN'
        );
      });
     } else {
      this.total = res.result.count;
      this.loginHistory = [];
      }
    })
  }

  applyFilter(searchTerm: string) {
    this.search = searchTerm;
    this.getLoginHistory(searchTerm);
  }

  initColumns() {
    this.loginHistoryTableColumns = [
      {
        name: 'id',
        dataKey: 'id',
        position: 'left',
        isSortable: true,
        textColor: 'text-secondary',
      },
      {
        name: 'User',
        dataKey: 'username',
        nestedObjectKey: 'user',
        position: 'left',
        isSortable: false,
        textColor: 'text-300',
      },
      {
        name: 'Login Status',
        dataKey: 'login_status',
        position: 'left',
        isSortable: true,
        textColor: 'text-secondary',
      },
      {
        name: 'IP Address',
        dataKey: 'ip_address',
        position: 'left',
        isSortable: true,
        textColor: 'text-300',
      },
      {
        name: 'Created',
        dataKey: 'created_at',
        position: 'left',
        isSortable: true,
        textColor: 'text-300',
      },
      {
        name: 'Modified',
        dataKey: 'updated_at',
        position: 'left',
        isSortable: true,
        textColor: 'text-300',
      },
    ];
  }

  handleSortChange(event: any) {
    this.getLoginHistory(
      this.search,
      event.active,
      event.direction,
      event.pageIndex,
      event.pageSize
      )
  }

  handlePageChange(event: any) {
    this.getLoginHistory(
      this.search,
      event.active,
      event.direction,
      event.pageIndex,
      event.pageSize
      )
  }

  onAction(actionEvent: any) {
    switch (actionEvent.actionName) {
      case 'details':
        console.log(actionEvent.row);
        // this.router.navigate(['roles/manage-role', { detail: actionEvent.row }]);
        break;
      default:
        break;
    }
  }
}
