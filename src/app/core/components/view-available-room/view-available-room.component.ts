import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/view.room.service';
import { Room } from '../../../interfaces/models/room';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { UserBookingService } from '../../../services/user-booking.service';
import { DatePipe } from '@angular/common';
import { Hotel } from '../../../interfaces/models/hotels';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-view-available-room',
  templateUrl: './view-available-room.component.html',
  styleUrls: ['./view-available-room.component.scss'],
  providers: [MessageService],
})
export class ViewAvailableRoomComponent implements OnInit {
  rooms?: Room[];
  filterText: string = '';
  filteredRooms?: Room[];
  sortType?: string[];
  selectedSortType?: string;
  displayModal: boolean = false;
  selectedRoomId?: number;
  selectedRoom?: Room;
  location?: string;
  realLocation?: string;
  rangeDates?: Date[];
  formattedRangeDates?: string;
  hotels?: Hotel[];
  showSliders: boolean = false;
  NumberOfRoom: number;
  NumberOfAdult: number;
  NumberOfChildren: number;


  constructor(
    private userBookingData: UserBookingService,
    public layoutService: LayoutService,
    public router: Router,
    private messageService: MessageService,
    private roomService: RoomService,
    private datePipe: DatePipe
  ) {
    this.NumberOfAdult = 1;
    this.NumberOfChildren = 0;
    this.NumberOfRoom = 1;
  }

  ngOnInit(): void {
    console.log(this.NumberOfAdult);

    this.sortType = ['Price Low To High', 'Price High To Low'];
    this.roomService.getAvailableRoom().subscribe((response: Room[]) => {
      this.rooms = response;
      this.filteredRooms = response;
    });

    this.userBookingData.currentLocation.subscribe((location) => {
      this.location = location;
    });

    this.userBookingData.currentRangeDates.subscribe((rangeDates) => {
      this.rangeDates = rangeDates;
      if (rangeDates && rangeDates.length === 2) {
        const start =
          this.datePipe.transform(rangeDates[0], 'dd/MM/yyyy') || '';
        const end = this.datePipe.transform(rangeDates[1], 'dd/MM/yyyy') || '';
        this.formattedRangeDates = `${start} - ${end}`;
      } else {
        this.formattedRangeDates = '';
      }
    });


    this.roomService.getHotel().subscribe(
      (response: Hotel[]) => {
        this.hotels = response;
      }
    );
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleSliders();
    }
  }

  filterRooms(): void {
    let rooms = this.rooms || [];
    if (this.filterText) {
      rooms = rooms.filter((room) =>
        room.type?.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    if (this.selectedSortType) {
      if (this.selectedSortType === 'Price Low To High') {
        rooms.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      } else if (this.selectedSortType === 'Price High To Low') {
        rooms.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      }
    }

    this.filteredRooms = rooms;
  }

  openModal(id: number | undefined): void {
    this.selectedRoomId = id;
    this.selectedRoom = this.rooms?.find((room) => room.id === id);
    this.displayModal = true;
  }

  closeModal(): void {
    this.displayModal = false;
    this.selectedRoom = undefined;
  }

  toBookingPage(id?: number): void {
    this.selectedRoomId = id;
    this.selectedRoom = this.rooms?.find((room) => room.id === id);
    this.router.navigate(['/booking-room', id]);
  }
  onLocationChange(event: any): void {
    this.location = event.address;
    this.realLocation = this.location;
  }

  checkPeopleCount(): void {
    if (this.NumberOfAdult + this.NumberOfChildren > 8) {
      this.messageService.clear('peopleCount');
      this.messageService.add({
        key: 'peopleCount',
        severity: 'error',
        summary: 'Error',
        detail: 'Adult + Children must be smaller than 8'
      });
    }
  }

  toggleSliders(): void {
    this.showSliders = !this.showSliders;
  }
}
