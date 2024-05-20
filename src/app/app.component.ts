/* eslint-disable no-return-assign */
import { Component } from '@angular/core';
import { User } from './interfaces/models/user';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FE-SheritonHotel';
  user?: User | null;

  constructor(private authService: AuthenticationService) {
    this.authService.user.subscribe(x => this.user = x);
  }

  logOut(): void {
    this.authService.logOut();
  }
}
