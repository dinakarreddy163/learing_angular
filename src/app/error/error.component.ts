import { Component, OnInit } from '@angular/core';
import { Errors, Error } from './errors';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  public errorId!: string;
  public error!: Error;

  constructor(private route: ActivatedRoute) {
    this.errorId = this.route.snapshot.paramMap.get('id') as string;
    this.error = Errors[this.errorId];
  }
}
