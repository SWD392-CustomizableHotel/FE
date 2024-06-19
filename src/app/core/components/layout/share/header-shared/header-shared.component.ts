import { ThemeService } from '../../../../../services/theme.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { User } from '../../../../../interfaces/models/user';
import { MenuItem } from 'primeng/api';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { Room } from '../../../../../interfaces/models/room';
import { RoomService } from '../../../../../services/view.room.service';

@Component({
  selector: 'app-header-shared',
  templateUrl: './header-shared.component.html',
  styleUrls: ['./header-shared.component.scss']
})
export class HeaderSharedComponent implements OnInit {
  cities: string[] = ['Ho Chi Minh City', 'Ha Noi Capital', 'Da Nang City', 'Hue City'];
  menuItems: string[] = ['Home', 'Features', 'Highlights', 'Pricing'];
  user?: User | null;
  rooms?: Room[];
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  checked: boolean = false;
  selectedTheme: string = 'dark';

  constructor(
    private themeService: ThemeService,
    private roomService: RoomService,
    public router: Router,
    public layoutService: LayoutService,
    private authService: AuthenticationService
  ) {
    this.authService.user.subscribe(x => {
      this.user = x;
    });
  }

  ngOnInit(): void {
    this.themeService.setTheme(this.selectedTheme);
    this.roomService.getAvailableRoom().subscribe(
      (response: Room[]) => {
        this.rooms = response;
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  onMenuItemClick(item: string): void {
    console.log(item + ' clicked');
  }

  navigateToViewAvailableRoom(): void {
    this.router.navigate(['/view-available-room'], { fragment: 'view-available-room' });
  }

  navigateTo(fragment: string): void {
    this.router.navigate(['/landing'], { fragment: fragment });
  }

  onThemeChange(theme: string): void {
    this.selectedTheme = theme;
    this.themeService.setTheme(theme);
  }

  toLoginPage(): void {
    this.router.navigate(['/login']);
  }

  logOut(): void {
    this.authService.logOut();
  }
}
