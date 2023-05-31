import { Component } from '@angular/core';
@Component({
  selector: 'lps-admin-home-layout',
  template: `
    <mat-sidenav-container class="sidenav-container" autosize>
      <mat-sidenav
        #sidenav
        mode="side"
        [fixedInViewport]="true"
        disableClose="true"
        opened="true"
      >
        <app-sidenav-menu #sidenavComp></app-sidenav-menu>
      </mat-sidenav>
      <mat-sidenav-content>
        <div class="sidenav-content">
          <app-header [sidenavComp]="sidenavComp"></app-header>
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100%;
      }
    `,
  ],
})
export class HomeLayoutComponent {}
