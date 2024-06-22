import { Component } from '@angular/core';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  formGroup: FormGroup;
  value: number = 5;
  showMore = false;
  selectedCity: any;
  items: MenuItem[] = [];
  menuVisible: boolean = false;
  isLoggedIn: boolean = true;

  constructor(
    public layoutService: LayoutService,
    public router: Router,
    public socialAuthServive: SocialAuthService,
    private formBuilder: FormBuilder,
    public authenticationService: AuthenticationService
  ) {
    this.formGroup = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
    });
  }

  toggleSeeMore(): void {
    this.showMore = !this.showMore;
    this.menuVisible = !this.menuVisible;
  }

  resetShowAdditionalInfoFormState(): void {
    this.authenticationService.resetAdditionalInfoFormState();
  }

  ngOnInit(): void {
    this.authenticationService.isLoggedIn.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
    this.resetShowAdditionalInfoFormState();
  }

  cities = [
    { name: 'Ho Chi Minh City' },
    { name: 'Hue City' },
    { name: 'Da Nang City' },
    { name: 'Ha Noi Capital' },
  ];

  logout(): void {
    this.authenticationService.logOut();
  }
}
