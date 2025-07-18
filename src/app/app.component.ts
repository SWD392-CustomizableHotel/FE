/* eslint-disable no-return-assign */
import { Component, OnInit } from '@angular/core';
import { User } from './interfaces/models/user';
import { AuthenticationService } from './services/authentication.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'FE-SheritonHotel';
  user?: User | null;

  constructor(private authService: AuthenticationService, private primengConfig: PrimeNGConfig) {
    this.authService.user.subscribe(x => this.user = x);
  }
  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  logOut(): void {
    this.authService.logOut();
  }
}
