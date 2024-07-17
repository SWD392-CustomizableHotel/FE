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
    { label: 'Customizing Room', route: 'customizing-room' }
  ];
  profileItems: MenuItem[] = [
    {
      label: 'History',
      items: [
        {
          label: 'View Order History',
          icon: 'pi pi-search',
          shortcut: '⌘+S',
          command: () => this.navigateTo('booking-history'),
        },
      ],
    },
    {
      label: 'Profile',
      items: [
        {
          label: 'Update Profile',
          icon: 'pi pi-cog',
          shortcut: '⌘+O',
          command: () => this.navigateTo('update-profile'),
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          shortcut: '⌘+Q',
          command: () => this.logout(),
        },
      ],
    },
    {
      separator: true,
    },
    {
      template: () => `
        <div class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
          <span class="inline-flex flex-column">
            <span class="font-bold">${this.user?.firstName} ${this.user?.lastName}</span>
            <span class="text-sm">${this.user?.role}</span>
          </span>
        </div>
      `,
    },
  ];

  constructor(
    public router: Router,
    private authService: AuthenticationService,
    private googleCommonService: GoogleCommonService
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
    if (route === 'customizing-room') {
      this.router.navigate(['/customizing-room'], {
        fragment: 'customizing-room',
      });
    } else {
      this.router.navigate(['/landing'], { fragment: route });
    }
    this.router.navigate([route]);
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn.value;
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedIn.next(value);
  }

  logout(): void {
    this.authService.logOut();
    this.googleCommonService.signOutExternal();
    // this.googleCommonService.setShowAdditionalInfoForm(false);
  }
}
