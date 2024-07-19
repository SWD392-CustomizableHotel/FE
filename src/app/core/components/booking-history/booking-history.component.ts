import { BookingService } from '../../../services/booking.service';
import { MessageService } from 'primeng/api';
import { BookingHistoryDto } from '../../../interfaces/models/booking-history-dto';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { Service } from '../../../interfaces/models/service';
import { Amenity } from '../../../interfaces/models/amenity';
import { Payment } from '../../../interfaces/models/payment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
  providers: [MessageService, DialogService]
})
export class BookingHistoryComponent implements OnInit {
  serviceDialogVisible: boolean = false;
  amenityDialogVisible: boolean = false;
  paymentDialogVisible: boolean = false;
  selectedService: Service[] = [];
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
  service: Service = {};
  amenity: Amenity = {};
  payment: Payment = {};

  constructor(
    private bookingService: BookingService,
    private messageService: MessageService,
    private dialogService: DialogService,
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
    this.bookingService.getBookingHistory(pageNumber, pageSize, roomType, searchTerm)
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

  openServiceDialog(service: Service[]) : void {
    this.selectedService = service;
    this.serviceDialogVisible = true;
  }

  closeServiceDialog() : void {
    this.serviceDialogVisible = false;
  }

  openAmenityDialog(amenity: Amenity[]) : void {
    this.selectedAmenity = amenity;
    this.amenityDialogVisible = true;
  }

  closeAmenityDialog() : void {
    this.amenityDialogVisible = false;
  }

  openPaymentDialog(payment: Payment[]) : void {
    this.selectedPayment = payment;
    this.paymentDialogVisible = true;
  }

  closePaymentDialog() : void {
    this.paymentDialogVisible = false;
  }

}
