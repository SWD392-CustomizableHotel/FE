/* eslint-disable no-return-assign */
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';
import { User } from '../../../../interfaces/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  checked: boolean = false;
  selectedTheme: string = 'dark';
  user?: User | null;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.authService.user.subscribe(x => this.user = x);
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
