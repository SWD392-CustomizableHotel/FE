import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { User } from '../../../../../interfaces/models/user';
import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { GoogleCommonService } from '../../../../../services/google-common.service';

@Component({
  selector: 'app-header-shared',
  templateUrl: './header-shared.component.html',
  styleUrls: ['./header-shared.component.scss'],
})
export class HeaderSharedComponent implements OnInit {
  menuVisible: boolean = false;
  isLoggedIn: boolean = false;
  user?: User | null;
  menuItems: MenuItem[] = [
    { label: 'Home', route: 'home' },
    { label: 'Features', route: 'features' },
    { label: 'Highlights', route: 'highlights' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'View Available Room', route: 'view-available-room' },
  ];

  constructor(
    public router: Router,
    private authService: AuthenticationService,
    private googleCommonService: GoogleCommonService
  ) {}

  ngOnInit(): void {
    this.googleCommonService._isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.user = loggedIn ? this.authService.userValue : null;
    });

    this.authService.user.subscribe((x) => {
      this.user = x;
    });
  }

  onMenuItemClick(route: string): void {
    console.log(route + ' clicked');
    this.router.navigate([route]);
  }

  navigateTo(route: string): void {
    if (route === 'view-available-room') {
      this.router.navigate(['/view-available-room'], {
        fragment: 'view-available-room',
      });
    } else {
      this.router.navigate(['/landing'], { fragment: route });
    }
  }

  logout(): void {
    this.authService.logOut();
  }
}
