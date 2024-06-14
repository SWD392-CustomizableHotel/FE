import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/view.room.service';
import { Room } from '../../../interfaces/models/room';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent implements OnInit {
  rooms?: Room[];
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
  constructor(public layoutService: LayoutService, public router: Router, private roomService: ApiService, private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      startDate: [''],
      endDate: ['']
    });
  }

  navigateToViewAvailableRoom(): void {
    this.router.navigate(['/view-available-room'], { fragment: 'view-available-room' });
  }

  ngOnInit(): void {
    this.roomService.getAvailableRoom().subscribe(
      (response: Room[]) => {
        this.rooms = response;
        console.log('Rooms fetched successfully', this.rooms);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }
}

