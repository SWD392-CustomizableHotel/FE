import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/view.room.service';
import { Room } from '../../../interfaces/models/room';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { UserBookingService } from '../../../services/user-booking.service';
import { DatePipe } from '@angular/common';
import { Hotel } from '../../../interfaces/models/hotels';
import { MessageService } from 'primeng/api';
import { WebSocketService } from '../../../services/web-socket.service';

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
  startDate?: string;
  endDate?: string;
  booking_room?: number[];

  constructor(
    private userBookingData: UserBookingService,
    public layoutService: LayoutService,
    public router: Router,
    private messageService: MessageService,
    private roomService: RoomService,
    private datePipe: DatePipe,
    private WebSocket: WebSocketService
  ) {
    this.NumberOfAdult = 1;
    this.NumberOfChildren = 0;
    this.NumberOfRoom = 1;
  }
  visible: boolean = false;

  ngOnInit(): void {
    this.sortType = ['Price Low To High', 'Price High To Low'];
    // Kiểm tra xem trong có room nào đang book không
    if(localStorage.getItem('booking_room') !== null) {
      // nếu có thì láy lại room đang booking đó để filter lại không hiện ra cho user này
      this.booking_room = JSON.parse(localStorage.getItem('booking_room')!);
    } else {
      // nếu không thì khởi tạo nó là 1 mảng rỗng để khi user khác vào thì add nó vào booking_room
      this.booking_room = [];
    }
    this.initializeData();
    this.WebSocket.ws.onmessage = (event: any) : void => {
      // Sắp xếp theo SocketIO
      this.WebSocket.data = event.data;
          console.log(event);
    if(this.WebSocket.data !== null && this.filteredRooms !== undefined) {
      const roomId2 = this.WebSocket.data?.split('_')[0];
      const userId2 = this.WebSocket.data?.split('_')[1];
      const userId = localStorage.getItem('userId');
      if(userId2 !== userId) {
        // Kiểm tra xong roomId2 có nằm trong danh sách của những phòng đang được đặt không
        if(this.booking_room?.indexOf(parseInt(roomId2!)) !== -1) {
          // Nếu có thì xóa nó khỏi danh sách phòng đang đặt
          this.booking_room?.splice(this.booking_room.indexOf(parseInt(roomId2!)), 1);
        } else {
          // Nếu không thì đưa nó vào danh sách booking_room
          this.booking_room?.push(parseInt(roomId2!));
        }
        localStorage.setItem('booking_room', JSON.stringify(this.booking_room));
      }
      this.filterRooms();
      console.log(this.booking_room);
    }
    };
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
          const start =
            this.datePipe.transform(room.startDate, 'dd/MM/yyyy') || '';
          this.startDate = start;
          const end = this.datePipe.transform(room.endDate, 'dd/MM/yyyy') || '';
          this.endDate = end;
        });
        this.filteredRooms = [...this.rooms]; // Copy the rooms array
        resolve();
      });
    });
  }

  subscribeToUserBookingData(): void {
    this.userBookingData.currentLocation.subscribe((location) => {
      this.location = location;
      if (this.rooms) {
        this.filterRooms();
      }
    });

    this.userBookingData.currentPeopleCount.subscribe((peopleCount) => {
      this.NumberOfAdult = peopleCount.adults;
      this.NumberOfChildren = peopleCount.children;
      this.NumberOfRoom = peopleCount.rooms;
      if (this.rooms) {
        this.filterRooms();
      }
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
    if (!this.rooms) {
      return;
    }

    // Bắt đầu với danh sách phòng đầy đủ
    this.filteredRooms = [...this.rooms];

    // Lọc theo văn bản nhập vào
    if (this.filterText) {
      this.filteredRooms = this.filteredRooms.filter((room) =>
        room.type?.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    if (this.NumberOfAdult !== null && this.NumberOfChildren !== null) {
      this.filteredRooms = this.filteredRooms.filter(
          (room) =>
              this.NumberOfAdult + this.NumberOfChildren === room.numberOfPeople
      );
  }


    // Lọc theo địa điểm
    if (this.location) {
      this.filteredRooms = this.filteredRooms.filter((room) => {
        const hotel = this.hotels?.find((h) => h.id === room.hotelId);
        if (hotel) {
          return hotel.address
            ?.toLowerCase()
            .includes(this.location!.toLowerCase());
        }
        return false;
      });
    }

    // Lọc theo khoảng thời gian
    if (this.rangeDates && this.rangeDates.length === 2) {
      this.filteredRooms = this.filteredRooms.filter(
        (room) =>
          room.startDate <= this.rangeDates![0] &&
          room.endDate >= this.rangeDates![1]
      );
    }

    // Sắp xếp nếu selectedSortType được định nghĩa
    if (this.selectedSortType) {
      if (this.selectedSortType === 'Price Low To High') {
        this.filteredRooms.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      } else if (this.selectedSortType === 'Price High To Low') {
        this.filteredRooms.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      }
    }

    // Lọc theo người đặt
    if(this.booking_room !== undefined) {
      this.filteredRooms = this.filteredRooms.filter((room) => {
        return !(this.booking_room?.indexOf(room.id!) !== -1);
      });
    }
  }

  openModal(id: number | undefined): void {
    this.selectedRoomId = id;
    this.selectedRoom = this.rooms?.find((room) => room.id === id);
    this.displayModal = true;
    this.showDialog();
  }

  showDialog(): void {
    this.visible = true;
  }

  closeModal(): void {
    this.displayModal = false;
    this.selectedRoom = undefined;
  }

  toBookingPage(id?: number): void {
    this.selectedRoomId = id;
    this.selectedRoom = this.rooms?.find((room) => room.id === id);
    const userId = localStorage.getItem('userId');
    this.sendMessage(`${id}_${userId}`);
    this.router.navigate(['/booking-room', id]);
  }

  onLocationChange(event: any): void {
    this.location = event.address;
    this.filterRooms();

  }
  onAdultsChange(event: any):void {
    this.NumberOfAdult = event;
    this.filterRooms();
  }

  onChildrenChange(event: any):void {
    this.NumberOfChildren = event;
    this.filterRooms();
  }

  onDateChange(): void {
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

  sendMessage(message: string):void {
    this.WebSocket.sendMessage(message);
    localStorage.setItem('socket_connection', message);
    console.log('the button is pressed');
  }
}
