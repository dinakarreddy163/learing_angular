import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss'],
})
export class SidenavMenuComponent {
  isExpanded = false;
  showRolesAndPermissionsSubMenu = false;
  standAloneLinkActive =  false;
  showUsersSubMenu = false;

  activeLinkParent(link: string) {
   switch (link) {
    case 'users':
      this.showUsersSubMenu = !this.showUsersSubMenu;
      this.showRolesAndPermissionsSubMenu = false;
      this.standAloneLinkActive = false;
      break;
    case 'rolesAndPermissions':
      this.showRolesAndPermissionsSubMenu = !this.showRolesAndPermissionsSubMenu;
      this.showUsersSubMenu = false;
      this.standAloneLinkActive = false;
      break;
    default:
      this.showRolesAndPermissionsSubMenu = false;
      this.showUsersSubMenu = false;
      this.standAloneLinkActive = true;
      break;
   }
  }
}
