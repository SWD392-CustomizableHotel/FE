/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Room } from '../../../../interfaces/models/rooms';
import { RoomService } from '../../../../services/room.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Hotel } from '../../../../interfaces/models/hotels';
import { HotelService } from '../../../../services/hotel.service';

interface ExpandedRows {
  [key: string]: boolean;
}

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
  providers: [MessageService]
})
export class RoomsComponent implements OnInit {
  roomDialog: boolean = false;
  createRoomDialog: boolean = false;
  deleteRoomDialog: boolean = false;
  rooms: Room[] = [];
  room: Room = {};
  hotels: Hotel[] = [];
  hotel: Hotel = {};
  expandedRows: ExpandedRows = {};
  cols: any[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  rowsPerPageOptions = [5, 10, 20];
  submitted: boolean = false;
  loading: boolean = true;
  roomStatusOptions = [
    { status: 'Available' },
    { status: 'Occupied' },
    { status: 'Maintenance' },
  ];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
];
  selectedRoomStatus: { status: string } | undefined;
  @ViewChild('filter') filter!: ElementRef;
  constructor(private roomService : RoomService, private hotelService: HotelService, private messageService: MessageService) {}
  ngOnInit(): void {
    this.loadRooms(1, this.rows);
      this.cols = [
        { field: 'roomId', header: 'Room ID'},
        { field: 'roomNumber', header: 'Room Number' },
        { field: 'roomPrice', header: 'Room Price' },
        { field: 'roomType', header: 'Room Type' },
        { field: 'roomStatus', header: 'Room Status' },
      ];
     this.loadHotels();
  }

  private loadRooms(pageNumber: number, pageSize: number): void {
    this.loading = true;
    this.roomService.getRooms(pageNumber, pageSize).subscribe(data => {
      this.rooms = data.data
      .map((room: Room) => {
        return {
          ...room,
          roomStatus: this.roomStatusOptions.find(option => option.status === room.roomStatus)
        };
      });
      this.loading = false;
      this.totalRecords = data.totalRecords;
      this.totalPages = data.totalPages;
    });
  }

  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe(data => {
      this.hotels = data.data;
    });
  }

  openNew() {
    this.room = {};
    this.submitted = false;
    this.createRoomDialog = true;
  }

  editRoom(room : Room) {
    this.room = {...room};
    this.roomDialog = true;
  }

  hideDialog() {
    this.roomDialog = false;
    this.submitted = false;
    this.createRoomDialog = false;
  }

  deleteRoom(room : Room) {
    this.deleteRoomDialog = true;
    this.room = {...room};
  }

  confirmDelete() {
    this.deleteRoomDialog = false;
    if(this.room.roomId !== undefined) {
      this.roomService.deleteRoom(this.room.roomId).subscribe(() => {
        this.rooms = this.rooms.filter(val => val.roomId !== this.room.roomId);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Room Deleted', life: 3000 });
        this.room = {};
      }, error => {
        console.error('Error deleting room:', error);
      });
    } else {
      console.error('Room ID is undefined');
    }
  }

  saveRoom() {
    this.submitted = true;

    const emptyFields = this.getEmptyFields();
    if (emptyFields.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `The following fields must be filled out to create a room: ${emptyFields.join(', ')}`,
        life: 3000
      });
    } else {
      if(this.room.roomId !== undefined) {
        this.roomService.editRoomDetails(this.room.roomId, this.room.roomType || '', this.room.roomPrice || 0).subscribe(() => {
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Room Updated', life: 3000});
        });
      } else {
        if (this.selectedRoomStatus) {
          this.room.roomStatus = this.selectedRoomStatus.status;
        }
        if (this.room.roomType && this.room.roomPrice && this.room.roomDescription && this.room.roomStatus && this.room.roomNumber && this.room.hotelId) {
          if (this.selectedRoomStatus) {
            this.room.roomStatus = this.selectedRoomStatus.status;
          }
          console.log('Room Type:', this.room.roomType);
          console.log('Room Price:', this.room.roomPrice);
          console.log('Room Description:', this.room.roomDescription);
          console.log('Room Status:', this.room.roomStatus);
          console.log('Room Number:', this.room.roomNumber);
          console.log('Hotel ID:', this.room.hotelId);
          this.roomService.createRoom(this.room.roomType,
          this.room.roomPrice, this.room.roomDescription,
          this.room.roomStatus, this.room.roomNumber, this.room.hotelId).subscribe(() => {
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Room Created', life: 3000});
          },  error => {
            this.messageService.add({severity:'error', summary: 'Error', detail: error.error.message, life: 3000});
          });
        }
      }
    }
    this.loadRooms(this.first / this.rows + 1, this.rows);
    this.createRoomDialog = false;
    this.roomDialog = false;
    this.room = {};
  }

  updateRoomStatus(room: Room, newStatus: any) {
    const statusString = newStatus.status;
    if (room.roomId !== undefined) {
      this.roomService.updateRoomStatus(room.roomId, statusString).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Room Status Updated', life: 3000});
      });
    } else {
      console.error('Room ID is undefined');
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onPageChange(event: PageEvent) {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const pageNumber = this.first / this.rows + 1;
    this.loadRooms(pageNumber, this.rows);
  }

  onRowsChange(newRows: number) {
    this.first = 0;
    this.rows = newRows;
    this.loadRooms(1, this.rows);
  }
  private getEmptyFields(): string[] {
    const emptyFields = [];
    if (!this.room.roomType) emptyFields.push('Room Type');
    if (!this.room.roomPrice) emptyFields.push('Room Price');
    if (!this.room.roomDescription) emptyFields.push('Room Description');
    if (!this.selectedRoomStatus?.status) emptyFields.push('Room Status');
    if (!this.room.roomNumber) emptyFields.push('Room Number');
    if (!this.room.hotelId) emptyFields.push('Hotel');
    return emptyFields;
  }
}
