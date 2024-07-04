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
  rangeDates?: Date[];
  formattedRangeDates?: string;
  hotels?: Hotel[];
  showSliders: boolean = false;
  NumberOfRoom: number;
  NumberOfAdult: number;
  NumberOfChildren: number;
  startDateFilter?: Date;
  hotelId?: number;

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
    this.sortType = ['Price Low To High', 'Price High To Low'];
    this.initializeData();
  }

  async initializeData(): Promise<void> {
    await this.getAvailableRooms();
    this.subscribeToUserBookingData();
    await this.getHotels();
    this.filterRooms();
  }

  getAvailableRooms(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.roomService.getAvailableRoom().subscribe((response: Room[]) => {
        this.rooms = response;
        this.rooms.forEach((room) => {
          room.startDate = new Date(Date.parse(room.startDate));
          room.endDate = new Date(Date.parse(room.endDate));
        });
        this.filteredRooms = [...this.rooms]; // Copy the rooms array
        console.log('Rooms initialized:', this.rooms);
        resolve();
      });
    });
  }

  subscribeToUserBookingData(): void {
    this.userBookingData.currentLocation.subscribe((location) => {
      this.location = location;
      console.log('Location subscription triggered:', location);
      if (this.rooms) {
        this.filterRooms();
      }
    });

    this.userBookingData.currentPeopleCount.subscribe((peopleCount) => {
      this.NumberOfAdult = peopleCount.adults;
      this.NumberOfChildren = peopleCount.children;
      this.NumberOfRoom = peopleCount.rooms;
    });

    this.userBookingData.currentRangeDates.subscribe((rangeDates) => {
      this.rangeDates = rangeDates;
      if (rangeDates && rangeDates.length === 2) {
        const start = this.datePipe.transform(rangeDates[0], 'dd/MM/yyyy') || '';
        const end = this.datePipe.transform(rangeDates[1], 'dd/MM/yyyy') || '';
        this.formattedRangeDates = `${start} - ${end}`;
      } else {
        this.formattedRangeDates = '';
      }
      console.log('Range dates subscription triggered:', rangeDates);
      if (this.rooms) {
        this.filterRooms();
      }
    });
  }


  getHotels(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.roomService.getHotel().subscribe((response: Hotel[]) => {
        this.hotels = response;
        this.hotels.find((h) => {
          if (h.address === this.location) {
            this.hotelId = h.id;
          }
        });
        resolve();
      });
    });
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleSliders();
    }
  }

  filterRooms(): void {
    console.log('filterRooms called');
    if (!this.rooms) {
      console.log('Rooms are not initialized');
      return;
    }

    // Bắt đầu với danh sách phòng đầy đủ
    this.filteredRooms = [...this.rooms];
    console.log('Starting filter with rooms:', this.filteredRooms);

    // Lọc theo văn bản nhập vào
    if (this.filterText) {
      this.filteredRooms = this.filteredRooms.filter((room) =>
        room.type?.toLowerCase().includes(this.filterText.toLowerCase())
      );
      console.log('After text filter:', this.filteredRooms);
    }

    // Lọc theo địa điểm
    if (this.location) {
      this.filteredRooms = this.filteredRooms.filter((room) => {
        const hotel = this.hotels?.find((h) => h.id === room.hotelId);
        if (hotel) {
          console.log(hotel.address);
          return hotel.address
            ?.toLowerCase()
            .includes(this.location!.toLowerCase());
        }
        return false;
      });
      console.log('After location filter:', this.filteredRooms);
    }

    // Lọc theo khoảng thời gian
    if (this.rangeDates && this.rangeDates.length === 2) {
      this.filteredRooms = this.filteredRooms.filter(
        (room) =>
          room.startDate <= this.rangeDates![0] &&
          room.endDate >= this.rangeDates![1]
      );
      console.log('After date range filter:', this.filteredRooms);
    }

    // Sắp xếp nếu selectedSortType được định nghĩa
    if (this.selectedSortType) {
      if (this.selectedSortType === 'Price Low To High') {
        this.filteredRooms.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      } else if (this.selectedSortType === 'Price High To Low') {
        this.filteredRooms.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      }
      console.log('After sorting:', this.filteredRooms);
    }

    console.log('Filtered rooms after all filters:', this.filteredRooms);
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
    this.filterRooms();
  }

  onDateChange():void {
    this.filterRooms();
  }

  checkPeopleCount(): void {
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

  toggleSliders(): void {
    this.showSliders = !this.showSliders;
  }
}
