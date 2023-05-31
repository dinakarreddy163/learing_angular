import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';

// Material Imports
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';

// Components
import { UsersComponent } from './users.component';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';
import { PersonalInfoComponent } from './edit-user-details/personal-info/personal-info.component';
import { AccountInfoComponent } from './edit-user-details/account-info/account-info.component';
import { PasswordChangeComponent } from './edit-user-details/password-change/password-change.component';
import { StatusPipe } from './status.pipe';
import { PermissionsPipe } from '../stand-alone-components/permissions.pipe';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { TableComponent } from '../stand-alone-components/table/table.component';


@NgModule({
  declarations: [
    UsersComponent,
    UserDetailsComponent,
    EditUserDetailsComponent,
    PersonalInfoComponent,
    UsersComponent,
    AccountInfoComponent,
    PasswordChangeComponent,
    CreateUserDialogComponent,
    LoginHistoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
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
    MatDialogModule,
    MatRadioModule,
    MatMenuModule,
    StatusPipe,
    PermissionsPipe,
    TableComponent
  ]
})
export class UsersModule { }
