/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Room } from '../../../interfaces/models/room';
import { MessageService } from 'primeng/api';
import { RoomService } from '../../../services/view.room.service';
import { Hotel } from '../../../interfaces/models/hotels';
import { UserBookingService } from '../../../services/user-booking.service';
import { AuthenticationService } from '../../../services/authentication.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  NumberOfRoom: number;
  NumberOfAdult: number;
  NumberOfChildren: number;
  location?: string;
  realLocation?: string;
  rooms?: Room[];
  rangeDates: Date[];
  value: number = 5;
  showMore = false;
  formGroup: FormGroup;
  showSliders: boolean = false;
  hotels?: Hotel[];
  isLoggedIn: boolean = true;
  selectedRoomId?: number;
  selectedRoom?: Room;

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
    public authenticationService: AuthenticationService,
    private userDataService: UserBookingService,
    private roomService: RoomService
  ) {
    this.formGroup = this.formBuilder.group({
      numberOfPeople: [null],
    });
    this.rangeDates = [];
    this.NumberOfAdult = 1;
    this.NumberOfChildren = 0;
    this.NumberOfRoom = 1;
  }

  ngOnInit(): void {
    this.roomService.getAvailableRoom().subscribe((response: Room[]) => {
      this.rooms = response;
    });
    this.roomService.getHotel().subscribe((response: Hotel[]) => {
      this.hotels = response;
    });
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
  goToBookingHistory() {
    this.router.navigate(['/booking-history']);
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
  onLocationChange(event: any) {
    this.location = event.address;
    this.realLocation = this.location;
  }

  toBookingPage(id?: number): void {
    this.selectedRoomId = id;
    this.selectedRoom = this.rooms?.find((room) => room.id === id);
    this.router.navigate(['/booking-room', id]);
  }

  toAvailableRoomPage(): void {
    this.userDataService.getLocation(this.realLocation);
    this.userDataService.getRangeDates(this.rangeDates);
    this.userDataService.getPeopleCount({
      rooms: this.NumberOfRoom,
      adults: this.NumberOfAdult,
      children: this.NumberOfChildren,
    });
    this.router.navigate(['/view-available-room']);
  }
  logout(): void {
    this.authenticationService.logOut();
  }
}
