import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, of, finalize } from 'rxjs';
import { User } from './users';
import { UsersService } from './users.service';

export class UsersDataSource implements DataSource<User> {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public length: number = 0;
  public loading$ = this.loadingSubject.asObservable();

  constructor(private usersService: UsersService) {}

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.loadingSubject.complete();
  }

  loadUsers(filter = '', sortBy = 'id',
              sortDirection = 'asc', pageIndex = 0, pageSize = 10, statuses = [''], roles = []) {
      this.loadingSubject.next(true);
      this.usersService
        .getUsers(
          filter,
          sortBy,
          sortDirection,
          pageIndex,
          pageSize,
          statuses,
          roles
        )
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((res: any) => {
            this.length = res.result.count;
            this.usersSubject.next(res.result.data);
        });
  }
}
