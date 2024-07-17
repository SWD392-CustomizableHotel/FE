/* eslint-disable no-return-assign */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';
import { User } from '../../../../interfaces/models/user';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../services/app.layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  cities: string[] = [
    'Ho Chi Minh City',
    'Ha Noi Capital',
    'Da Nang City',
    'Hue City',
  ];

  onMenuItemClick(item: string): void {
    console.log(item + ' clicked');
  }
  checked: boolean = false;
  selectedTheme: string = 'dark';
  user?: User | null;

  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    private themeService: ThemeService,
    public layoutService: LayoutService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.authService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.themeService.setTheme(this.selectedTheme);
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
