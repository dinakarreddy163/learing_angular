import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TableColumn } from './TableColumn';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataPropertyGetterPipe } from './data-property-getter.pipe';
import { MatButtonModule } from '@angular/material/button';
import { PermissionsPipe } from '../permissions.pipe';

@Component({
  selector: 'custom-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    NgFor,
    NgIf,
    NgClass,
    MatIconModule,
    MatPaginatorModule,
    UpperCasePipe,
    DataPropertyGetterPipe,
    PermissionsPipe
  ],
})
export class TableComponent implements OnInit, AfterViewInit {
  public tableDataSource = new MatTableDataSource([]);
  public displayedColumns!: string[];
  public tableDataSourceLength = 0;
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @Input() defaultSortProperty = '';
  @Input() defaultSortDirection: SortDirection = 'asc';

  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() tableColumns!: TableColumn[];
  @Input() rowActionIcons!: any;
  @Input() paginationSizes: number[] = [10, 25, 50, 100];
  @Input() defaultPageSize = this.paginationSizes[0];
  @Input() gateName: string = '';


  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() filter = new EventEmitter<string>();
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();

  // property setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }
  @Input() set total(total: number) {
    this.tableDataSourceLength = total;
  }

  constructor() {}

  ngOnInit(): void {
    const columnNames = this.tableColumns.map(
      (tableColumn: TableColumn) => tableColumn.name
    );
    if (this.rowActionIcons) {
      this.displayedColumns = [...columnNames, 'rowAction'];
    } else {
      this.displayedColumns = columnNames;
    }
  }

  /**  In order to make pagination work with *ngIf */
  ngAfterViewInit(): void {
    // this.tableDataSource.paginator = this.matPaginator;
  }

  // Setting table configs
  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource(data);
    if(!this.isPageable) this.tableDataSourceLength = this.tableDataSource.data.length;
    // this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
  }

  emitFilterEvent(event: Event) {
    this.matPaginator.pageIndex = 0;
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue.length >= 3 || filterValue === '') this.filter.emit(filterValue);
  }

  activeSortColumn(sortParameters: Sort) {
    return this.tableColumns.find(
      (column) => column.name === sortParameters.active
    )?.dataKey as string;
  }

  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    sortParameters.active = this.activeSortColumn(sortParameters);
    const pagigationParameters = {pageIndex: this.matPaginator.pageIndex, pageSize: this.matPaginator.pageSize}
    this.sort.emit({...sortParameters, ...pagigationParameters})
  }

  emitRowAction(actionName: string, row: any) {
    this.rowAction.emit({ actionName, row });
  }

  emitPageEvent(event: PageEvent) {
    this.matSort.active = this.activeSortColumn(this.matSort);
    const sortParameters = {active: this.matSort.active, direction: this.matSort.direction}
    this.pageChange.emit({...event, ...sortParameters})
  }
}
