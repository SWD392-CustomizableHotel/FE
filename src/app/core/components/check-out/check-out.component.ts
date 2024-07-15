/* eslint-disable no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BookingService } from '../../../services/booking.service';
import { Amenity } from '../../../interfaces/models/amenity';
import { Payment } from '../../../interfaces/models/payment';
import { BookingHistoryDto } from '../../../interfaces/models/booking-history-dto';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss',
  providers: [MessageService, DialogService]
})
export class CheckOutComponent implements OnInit {
  checkoutDetailsDialog: boolean = false;
  selectedAmenity: Amenity[] = [];
  selectedPayment: Payment[] = [];
  bookings: BookingHistoryDto[] = [];
  loading: boolean = true;
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;
  searchTerm?: string;
  selectedRoomType: { type: string } | undefined;
  cols: any[] = [];
  roomTypeOptions = [
    { type: 'Regular' },
    { type: 'Family' },
    { type: 'Luxury' },
  ];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];
  @ViewChild('filter') filter!: ElementRef;
  roomType?: string;
  booking: BookingHistoryDto = {};
  selectedCheckOutDetails: BookingHistoryDto | null = null;
  toArray(obj: any): any[] {
    return obj ? Object.values(obj) : [];
  }

  constructor(
    private bookingService: BookingService,
    private messageService: MessageService,
  ) {}
  ngOnInit(): void {
    this.cols = [
      { field: 'bookingId', header: 'Booking ID' },
      { field: 'roomType', header: 'Room Type' },
      { field: 'roomDescription', header: 'Room Description' },
      { field: 'rating', header: 'Rating' },
      { field: 'userName', header: 'User Name' },
      { field: 'services', header: 'Services' },
      { field: 'amenities', header: 'Amenities' },
      { field: 'payments', header: 'Payments' },
    ];
    this.loadBookings(1, this.rows, this.roomType, this.searchTerm);
  }
  private loadBookings(pageNumber: number, pageSize: number, roomType?: string, searchTerm?: string): void {
    this.loading = true;
    this.bookingService.checkout(pageNumber, pageSize, roomType, searchTerm)
      .subscribe({
        next: (data) => {
          this.bookings = data.data
          .map((booking : BookingHistoryDto) => {
            return {
              ...booking,
              roomType: this.roomTypeOptions.find(
                (option) => option.type === booking.roomType
              ),
            };
          })
          .sort((a: {id : number}, b: {id : number}) => b.id - a.id);
          this.totalRecords = data.totalRecords;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load booking history' });
        }
      });
  }
  viewCheckOutDetails(booking: BookingHistoryDto): void {
    const bookingId = booking.bookingId;
    if (bookingId !== undefined) {
      this.bookingService.getCheckOutDetails(bookingId).subscribe({
        next: (response) => {
          if (response && response.isSucceed && response.result) {
            this.selectedCheckOutDetails = response.result;
            this.checkoutDetailsDialog = true;
          } else {
            console.error('Empty response or missing data:', response);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch booking details' });
          }
        },
        error: (error) => {
          console.error('Error fetching booking details: ' + error);
        },
  });
  } else {
    console.error('Booking ID is undefined.');
  }
  }

  hideCheckOutDetailsDialog(): void {
    this.checkoutDetailsDialog = false;
    this.selectedCheckOutDetails = null;
  }

  onGlobalFilter(dt1: any, event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadBookings(1, this.rows, this.roomType, this.searchTerm);
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0;
    this.loadBookings(1, this.rows, this.roomType, this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const pageNumber = Math.floor(this.first / this.rows) + 1;
    this.loadBookings(pageNumber, this.rows, this.roomType, this.searchTerm);
  }

  clear(table: Table): void {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = undefined;
    this.loadBookings(1, this.rows, this.roomType, this.searchTerm);
  }

  onCheckOut(): void {
    console.log('CheckOut clicked');
  }

  onPayment(): void {
    console.log('Payment clicked');
  }
}
