import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { User } from '../../../../../interfaces/models/user';
import { MenuItem } from 'primeng/api';
import { Component } from '@angular/core';
import { GoogleCommonService } from '../../../../../services/google-common.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-header-shared',
  templateUrl: './header-shared.component.html',
  styleUrls: ['./header-shared.component.scss'],
})
export class HeaderSharedComponent {
  menuVisible: boolean = false;
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<string>('');
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
    private googleCommonService: GoogleCommonService,
  ) {
    this.googleCommonService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn.next(loggedIn);
      if (loggedIn) {
        this.user = this.authService.userValue;
      } else {
        this.user = null;
      }
    });
    this.googleCommonService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn.next(loggedIn);
    });
    this.authService.user.subscribe((x) => {
      this.user = x;
      if (this.user) {
        this.setLoggedIn(true);
      }
    });
  }
  onMenuItemClick(route: string): void {
    this.router.navigate([route]);
  }

  getRole(): string {
    return this.user?.role || '';
  }

  navigateInRole(route: string): void {
    const role = this.getRole();
    if (role === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate([route]);
    }
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

  getIsLoggedIn(): boolean {
    return this.isLoggedIn.value;
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedIn.next(value);
  }

  // ngOnInit(): void {
  //   this.authService.isLoggedIn.subscribe((loggedIn) => {
  //     this.isLoggedIn = loggedIn;
  //   });
  // }

  logout(): void {
    this.authService.logOut();
    this.googleCommonService.signOutExternal();
    // this.googleCommonService.setShowAdditionalInfoForm(false); 
  }
}
