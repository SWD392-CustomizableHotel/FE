import { Component } from '@angular/core';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(public layoutService: LayoutService, public router: Router) { }
}
