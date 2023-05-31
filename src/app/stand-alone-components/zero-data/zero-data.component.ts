import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingService } from 'src/app/loading/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { PermissionsPipe } from '../permissions.pipe';

@Component({
  selector: 'app-zero-data',
  templateUrl: './zero-data.component.html',
  styleUrls: ['./zero-data.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatButtonModule, AsyncPipe, NgIf, PermissionsPipe],
})
export class ZeroDataComponent {
  @Input() icon: string = '';
  @Input() zeroDataMessage: string = '';
  @Input() buttonIcon: string = '';
  @Input() buttonText: string = '';
  @Input() actionLink: string = '';
  @Input() gateName: string = '';
  @Input() permissionType: string = '';
  @Input() isDialog: boolean = false;
  @Output() openDialog = new EventEmitter();

  constructor(private router: Router, public loadingService: LoadingService) {}

  /**
   * If button action is open dialog emit event back to calle component else navigate to provided Link
   */
  performAction() {
    if (this.isDialog) {
      this.openDialog.emit(true);
    } else {
      this.router.navigate([this.actionLink]);
    }
  }
}
