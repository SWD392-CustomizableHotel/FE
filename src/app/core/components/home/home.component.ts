import { Component } from '@angular/core';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  value: number = 5;
  showMore = false;
  toggleSeeMore(): void {
    this.showMore = !this.showMore;
  }

  formGroup: FormGroup;
  cities = [
    { name: 'Ho Chi Minh City' },
    { name: 'Hue City' },
    { name: 'Da Nang City' },
    { name: 'Ha Noi Capital' }
  ];
  selectedCity: any;

  constructor(public layoutService: LayoutService, public router: Router, private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      startDate: [''],
      endDate: ['']
    });
  }
}