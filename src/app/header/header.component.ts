import { Component, ChangeDetectorRef, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/loading/loading.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  @Input() sidenavComp!: any;
  firstName: string | null = localStorage.getItem('first_name');
  lastName: string | null = localStorage.getItem('last_name');
  roleName: string | null = localStorage.getItem('role_name') || "";

  constructor(
    private router: Router,
    private utlisService: UtilsService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  get profileName() {
    return this.utlisService.profileName(this.firstName, this.lastName);
  }

  logout() {
    this.utlisService.removeUserData();
    this.router.navigate(['/login']);
  }
}
