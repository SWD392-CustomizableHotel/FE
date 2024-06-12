import { Component } from '@angular/core';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(public layoutService: LayoutService, public router: Router, public socialAuthServive: SocialAuthService) { }
  
  logout(): void {
    this.socialAuthServive.signOut().then(() => this.router.navigate(['/login']));
  }
}


