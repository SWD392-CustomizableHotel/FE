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
import { Router } from '@angular/router';

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
  paymentDialog: boolean = false;
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
  night: string = '';
  day: string = '';
  roomPriceSubtotal: number = 0;
  totalPrice: number = 0;
  paymentMethods: { label: string; value: string }[] = [];
  selectedPaymentMethod: string = '';
  customerCash: number = 0;
  returnAmount: number = 0;

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
    private router: Router,
    private bookingService: BookingService,
    private messageService: MessageService,
  ) {
    this.paymentMethods = [
      { label: 'Cash', value: 'cash' },
      { label: 'Card', value: 'card' },
      { label: 'Bank Account', value: 'bank' }
    ];
  }
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

  showPaymentDialog(): void {
    this.paymentDialog = true;
  }

  hidePaymentDialog(): void {
    this.paymentDialog = false;
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
    if (this.selectedCheckOutDetails && this.selectedCheckOutDetails.bookingId) {
      this.bookingService.checkOutAction(this.selectedCheckOutDetails.bookingId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Check-out successful!' });
          this.loadBookings(1, this.rows, this.roomType, this.searchTerm);
          this.hideCheckOutDetailsDialog();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Check-out failed!' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No booking selected for check-out!' });
    }
  }

  onPaymentMethodChange(): void {
    this.customerCash = 0;
    this.returnAmount = 0;
  }

  calculateReturnAmount(): void {
    if (this.selectedCheckOutDetails && this.selectedCheckOutDetails.totalPrice) {
      this.returnAmount = this.customerCash - this.selectedCheckOutDetails.totalPrice;
    }
  }

  makePayment(): void {
    if (this.selectedCheckOutDetails && this.selectedCheckOutDetails.bookingId) {
      const bookingDetails = this.selectedCheckOutDetails; // Save current selected check out details

      this.bookingService.paymentAction(this.selectedCheckOutDetails.bookingId, this.selectedPaymentMethod).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Payment successful!' });
          this.viewCheckOutDetails(bookingDetails); // Reload the check out details
          this.loadBookings(1, this.rows, this.roomType, this.searchTerm);
          this.hidePaymentDialog();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Payment failed!' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No booking selected for Payment!' });
    }
  }

  navigateToCheckIn(): void {
    this.router.navigate(['/upload-identity-card']);
  }
}
