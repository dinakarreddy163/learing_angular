import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PermissionsService } from '../permissions.service';

@Component({
  selector: 'app-name-description-form-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './name-description-form-dialog.component.html',
  styleUrls: ['./name-description-form-dialog.component.scss'],
})
export class NameAndDescriptionFormDialogComponent implements OnInit {
  nameAndDescriptionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utlisService: UtilsService,
    public dialogRef: MatDialogRef<NameAndDescriptionFormDialogComponent>,
    private permissionsService: PermissionsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.nameAndDescriptionForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(60)]],
    });
    if (this.data.isUpdate) {
      this.setDefaultValues();
    }
  }

  setDefaultValues() {
    this.nameAndDescriptionForm.patchValue({
      name: this.data.name,
      description: this.data.description,
    });
  }

  clearForm() {
    this.nameAndDescriptionForm.reset();
  }

  createOrUpdateForm(): void {
    const id = this.data.isUpdate ? this.data.id : null;
    const permissionGroupId = !this.data.isPermissionGroup
      ? this.data.permissionGroupId
      : null;
    this.permissionsService
      .createOrUpdateNameAndDescription(
        this.nameAndDescriptionForm.value,
        this.data.isPermissionGroup,
        id,
        permissionGroupId
      )
      .subscribe((res: any) => {
        if (res.success) {
          this.utlisService.showSuccessToast(res.message);
          this.close(res.success);
        } else {
          this.utlisService.showErrorToast(res.message);
        }
      });
  }

  close(res: any): void {
    this.dialogRef.close(res);
  }
}
