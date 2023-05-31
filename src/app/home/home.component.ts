import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'lps-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class HomeComponent {

  constructor(private http: HttpClient, private toast: HotToastService) {}
}
