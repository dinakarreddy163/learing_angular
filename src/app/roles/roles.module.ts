import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { TableComponent } from '../stand-alone-components/table/table.component';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataPropertyGetterPipe } from '../stand-alone-components/table/data-property-getter.pipe';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { UsersComponent } from './users/users.component';
import { SettingsComponent } from './settings/settings.component';
import { ZeroDataComponent } from '../stand-alone-components/zero-data/zero-data.component';
import { PermissionsPipe } from '../stand-alone-components/permissions.pipe';

@NgModule({
  declarations: [
    RolesComponent,
    CreateRoleComponent,
    ManageRoleComponent,
    PermissionsComponent,
    UsersComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RolesRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatTabsModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    ZeroDataComponent,
    DataPropertyGetterPipe,
    PermissionsPipe,
    TableComponent,
  ],
})
export class RolesModule {}
