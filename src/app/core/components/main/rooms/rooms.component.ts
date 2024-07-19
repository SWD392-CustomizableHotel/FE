/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Room } from '../../../../interfaces/models/rooms';
import { RoomService } from '../../../../services/room.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Hotel } from '../../../../interfaces/models/hotels';
import { HotelService } from '../../../../services/hotel.service';
import { format } from 'date-fns';

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
  providers: [MessageService],
})
export class RoomsComponent implements OnInit {
  isCreating: boolean = false;
  isEdit: boolean = false;
  roomDialog: boolean = false;
  createRoomDialog: boolean = false;
  deleteRoomDialog: boolean = false;
  canvasImageDialog: boolean = false;
  canvasImageSrc: string | undefined = '';
  submitted: boolean = false;
  loading: boolean = true;
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
  searchTerm?: string;
  roomStatus?: string;
  roomType?: string;
  imageFile: File | undefined = undefined;
  minStartDate: Date = new Date();
  minEndDate: Date = new Date();
  dateRange: Date[] = [];
  roomStatusOptions = [
    { status: 'Available' },
    { status: 'Occupied' },
    { status: 'Maintenance' },
    { status: 'Booked' },
  ];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  roomSizeOptions = [
    { label: 'Small', value: 'Small' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Large', value: 'Large' },
  ];
  roomTypeOptions = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Luxury', value: 'Luxury' },
    { label: 'Family', value: 'Family' },
    { label: 'Customizable', value: 'Customizable' },
  ];
  selectedRoomStatus: { status: string } | undefined;
  selectedRoomSize: { label: string; value: string } | undefined;
  selectedRoomType: { label: string; value: string } | undefined;
  @ViewChild('filter') filter!: ElementRef;
  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loadRooms(
      1,
      this.rows,
      this.roomStatus,
      this.roomType,
      this.searchTerm
    );
    this.cols = [
      { field: 'roomId', header: 'Room ID' },
      { field: 'roomNumber', header: 'Room Number' },
      { field: 'roomPrice', header: 'Room Price' },
      { field: 'roomType', header: 'Room Type' },
      { field: 'roomStatus', header: 'Room Status' },
      { field: 'imagePath', header: 'Room Image' },
      { field: 'numberOfPeople', header: 'Max Occupancy' },
    ];
    this.loadHotels();
  }

  private loadRooms(
    pageNumber: number,
    pageSize: number,
    roomStatus?: string,
    roomType?: string,
    searchTerm?: string
  ): void {
    this.loading = true;
    this.roomService
      .getRooms(pageNumber, pageSize, roomStatus, roomType, searchTerm)
      .subscribe({
        next: (data) => {
          this.rooms = data.data.map((room: Room) => {
            return {
              ...room,
              roomStatus: this.roomStatusOptions.find(
                (option) => option.status === room.roomStatus
              ),
            };
          });
          this.loading = false;
          this.totalRecords = data.totalRecords;
          this.totalPages = data.totalPages;
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
      });
  }

  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe((data) => {
      this.hotels = data.data;
    });
  }

  openNew() {
    this.room = {};
    this.submitted = false;
    this.createRoomDialog = true;
    this.selectedRoomType = undefined;
    this.selectedRoomSize = undefined;
    this.selectedRoomStatus = undefined;
    this.dateRange = [];
  }

  editRoom(room: Room) {
    this.room = { ...room };
    this.isEdit = true;
    this.roomDialog = true;
    this.selectedRoomType = this.roomTypeOptions.find(
      (option) => option.value === room.roomType
    );
  }

  hideDialog() {
    this.roomDialog = false;
    this.submitted = false;
    this.createRoomDialog = false;
  }

  deleteRoom(room: Room) {
    this.deleteRoomDialog = true;
    this.room = { ...room };
  }

  confirmDelete() {
    this.deleteRoomDialog = false;
    if (this.room.roomId !== undefined) {
      if (this.selectedRoomStatus?.status !== 'Occupied') {
        this.roomService.deleteRoom(this.room.roomId).subscribe(
          () => {
            this.rooms = this.rooms.filter(
              (val) => val.roomId !== this.room.roomId
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Room Deleted',
              life: 3000,
            });
            this.loadRooms(
              this.first / this.rows + 1,
              this.rows,
              this.roomStatus,
              this.roomType,
              this.searchTerm
            );
          },
          (error) => {
            console.error('Error deleting room:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error occurred while deleting the room.',
              life: 3000,
            });
          }
        );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot delete an occupied room.',
          life: 3000,
        });
      }
    } else {
      console.error('Room ID is undefined');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Room ID is undefined.',
        life: 3000,
      });
    }
  }

  saveRoom() {
    this.submitted = true;
    const emptyFields = this.getEmptyFields();
    if (emptyFields.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `Error: ${emptyFields.join(', ')}`,
        life: 3000,
      });
    } else {
      this.isCreating = true;
      if (this.room.roomId !== undefined) {
        this.roomService
          .editRoomDetails(
            this.room.roomId,
            this.selectedRoomType ? this.selectedRoomType.value : '',
            this.room.roomPrice || 0,
            this.imageFile
          )
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Room Updated',
              life: 3000,
            });
            this.isCreating = false; // Stop loading
            this.loadRooms(
              this.first / this.rows + 1,
              this.rows,
              this.roomStatus,
              this.roomType,
              this.searchTerm
            );
          });
      } else {
        const [startDate, endDate] = this.dateRange;
        const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
        const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");
        if (this.selectedRoomStatus) {
          this.room.roomStatus = this.selectedRoomStatus.status;
        }
        if (this.selectedRoomSize) {
          this.room.roomSize = this.selectedRoomSize.value;
        }
        if (this.selectedRoomType) {
          this.room.roomType = this.selectedRoomType.value;
        }
        this.room.startDate = formattedStartDate;
        this.room.endDate = formattedEndDate;
        if (
          this.room.roomType &&
          this.room.roomPrice &&
          this.room.roomDescription &&
          this.room.roomStatus &&
          this.room.roomSize &&
          this.room.hotelId &&
          this.imageFile &&
          this.room.numberOfPeople
        ) {
          if (this.selectedRoomStatus) {
            this.room.roomStatus = this.selectedRoomStatus.status;
          }
          this.roomService
            .createRoom(
              this.room.roomType,
              this.room.roomPrice,
              this.room.roomDescription,
              this.room.roomStatus,
              this.room.hotelId,
              this.imageFile!,
              this.room.roomSize,
              this.room.startDate,
              this.room.endDate,
              this.room.numberOfPeople
            )
            .subscribe(
              () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Room Created',
                  life: 3000,
                });
                this.isCreating = false; // Stop loading
                this.loadRooms(
                  this.first / this.rows + 1,
                  this.rows,
                  this.roomStatus,
                  this.roomType,
                  this.searchTerm
                );
              },
              (error) => {
                this.isCreating = false; // Stop loading
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.error.message,
                  life: 3000,
                });
              }
            );
        }
      }
    }
    this.isEdit = false;
    this.createRoomDialog = false;
    this.roomDialog = false;
    this.dateRange = [];
    this.room = {};
  }

  updateRoomStatus(room: Room, newStatus: any) {
    const statusString = newStatus.status;
    if (room.roomId !== undefined) {
      this.roomService
        .updateRoomStatus(room.roomId, statusString)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Room Status Updated',
            life: 3000,
          });
        });
    } else {
      console.error('Room ID is undefined');
    }
  }

  onGlobalFilter(dt1: any, event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadRooms(
      1,
      this.rows,
      this.roomStatus,
      this.roomType,
      this.searchTerm
    );
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = undefined;
    this.loadRooms(
      1,
      this.rows,
      this.roomStatus,
      this.roomType,
      this.searchTerm
    );
  }

  onPageChange(event: PageEvent) {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const pageNumber = this.first / this.rows + 1;
    this.loadRooms(
      pageNumber,
      this.rows,
      this.roomStatus,
      this.roomType,
      this.searchTerm
    );
  }

  onRowsChange(newRows: number) {
    this.first = 0;
    this.rows = newRows;
    this.loadRooms(
      1,
      this.rows,
      this.roomStatus,
      this.roomType,
      this.searchTerm
    );
  }
  private getEmptyFields(): string[] {
    const emptyFields = [];
    if (!this.isEdit) {
      if (!this.selectedRoomType?.value) emptyFields.push('Empty Room Type');
      if (!this.room.roomPrice) emptyFields.push('Empty Room Price');
      if (!this.room.roomDescription)
        emptyFields.push('Empty Room Description');
      if (!this.selectedRoomStatus?.status)
        emptyFields.push('Empty Room Status');
      if (!this.selectedRoomSize?.value) emptyFields.push('Empty Room Size');
      if (!this.room.hotelId) emptyFields.push('Empty Hotel');
      if (!this.imageFile) emptyFields.push('Empty Image');
      if (!this.dateRange || this.dateRange.length !== 2)
        emptyFields.push('Empty Start Date and End Date');
      if (
        this.dateRange &&
        this.dateRange.length === 2 &&
        this.dateRange[0].getTime() === this.dateRange[1].getTime()
      ) {
        emptyFields.push('End Date should not be the same as Start Date');
      }
    }
    if (this.isEdit) {
      if (this.room.roomType && !this.room.roomType.trim())
        emptyFields.push('Room Type');
      if (this.room.roomPrice && isNaN(this.room.roomPrice))
        emptyFields.push('Room Price');
    }
    return emptyFields;
  }

  onImageSelect(event: any) {
    this.imageFile = event.files[0];
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'The Image has been uploaded successfully.',
    });
  }

  onStartDateSelect(): void {
    if (this.room.startDate) {
      this.minEndDate = new Date(this.room.startDate);
      this.minEndDate.setDate(this.minEndDate.getDate() + 1); // End date must be at least one day after start date
      if (this.room.endDate && this.room.endDate <= this.room.startDate) {
        this.room.endDate = null; // Reset end date if it is before or on the start date
      }
    }
  }

  customizeRoom(room: Room) {
    if (room.canvasImage) {
      this.canvasImageSrc = room.canvasImage;
      this.canvasImageDialog = true;
    } else {
      console.error('No canvas image found for this room');
    }
  }
}
