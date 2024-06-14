/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Room } from '../../../../interfaces/models/rooms';
import { RoomService } from '../../../../services/room.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';


interface ExpandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  providers: [MessageService]
})
export class RoomsComponent implements OnInit {
  roomDialog: boolean = false;
  createRoomDialog: boolean = false;
  deleteRoomDialog: boolean = false;
  rooms: Room[] = [];
  room: Room = {};
  expandedRows: ExpandedRows = {};
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  submitted: boolean = false;
  loading: boolean = true;
  roomStatusOptions = [
    { status: 'Available' },
    { status: 'Occupied' },
    { status: 'Maintenance' },
  ];
  selectedRoomStatus: { status: string } | undefined;
  @ViewChild('filter') filter!: ElementRef;
  constructor(private roomService : RoomService, private messageService: MessageService) {}
  ngOnInit(): void {
     this.loadRooms();

      this.cols = [
        { field: 'roomId', header: 'Room ID'},
        { field: 'roomNumber', header: 'Room Number' },
        { field: 'roomPrice', header: 'Room Price' },
        { field: 'roomType', header: 'Room Type' },
        { field: 'roomStatus', header: 'Room Status' },
      ];
  }

  private loadRooms(): void {
    this.loading = true;
    this.roomService.getRooms(1, 10).subscribe(data => {
      this.rooms = data.data
      .filter((room : Room) => !room.isDeleted)
      .map((room: Room) => {
        return {
          ...room,
          roomStatus: this.roomStatusOptions.find(option => option.status === room.roomStatus),
          roomStatusValue: room.roomStatus
        };
      });
      this.loading = false;
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
    console.log(this.room.roomId);
    if(this.room.roomId !== undefined) {
      this.roomService.editRoomDetails(this.room.roomId, this.room.roomType || '', this.room.roomPrice || 0).subscribe(() => {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Room Updated', life: 3000});
        this.loadRooms();
      });
    } else {
      if (this.selectedRoomStatus) {
        this.room.roomStatus = this.selectedRoomStatus.status;
      }
      if (this.room.roomType && this.room.roomPrice && this.room.roomDescription && this.room.roomStatus && this.room.roomNumber && this.room.hotelId) {
        this.roomService.createRoom(this.room.roomType,
        this.room.roomPrice, this.room.roomDescription,
        this.room.roomStatus, this.room.roomNumber, this.room.hotelId).subscribe(() => {
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Room Created', life: 3000});
          this.loadRooms();
        },  error => {
          console.error('Error Creating room:', error);
        });
      } else {
        console.error('All fields must be filled out to create a room');
      }
    }
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
}
