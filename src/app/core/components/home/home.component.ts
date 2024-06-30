/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Room } from '../../../interfaces/models/room';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService],
})
export class HomeComponent {
  NumberOfRoom: number;
  NumberOfAdult: number;
  NumberOfChildren: number;
  rooms?: Room[];
  rangeDates: Date[];
  selectedCity: any;
  value: number = 5;
  showMore = false;
  formGroup: FormGroup;
  showSliders: boolean = false;
  isLoggedIn: boolean = true;

  cities = [
    { name: 'Ho Chi Minh City' },
    { name: 'Hue City' },
    { name: 'Da Nang City' },
    { name: 'Ha Noi Capital' },
  ];

  constructor(
    public layoutService: LayoutService,
    public router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public authenticationService: AuthenticationService
  ) {
    this.formGroup = this.formBuilder.group({
      numberOfPeople: [null],
    });
    this.rangeDates = [];
    this.NumberOfAdult = 1;
    this.NumberOfChildren = 0;
    this.NumberOfRoom = 1;
  }

  toggleSeeMore(): void {
    this.showMore = !this.showMore;
  }

  toggleSliders(): void {
    this.showSliders = !this.showSliders;
  }

  onSubmit() {
    const startDate = this.rangeDates ? this.rangeDates[0] : null;
    const endDate = this.rangeDates ? this.rangeDates[1] : null;
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
  }

  checkPeopleCount() {
    if (this.NumberOfAdult + this.NumberOfChildren > 8) {
      this.messageService.clear('peopleCount');
      this.messageService.add({
        key: 'peopleCount',
        severity: 'error',
        summary: 'Error',
        detail: 'Adult + Children must be smaller than 8',
      });
    }
  }
  logout(): void {
    this.authenticationService.logOut();
  }
}
