import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.scss'
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.getBookingHistory();
  }

  getBookingHistory(): void {
    this.bookingService.getBookingHistory(this.pageNumber, this.pageSize).subscribe(response => {
      this.bookings = response.data;
      this.pageNumber = response.pageNumber;
      this.pageSize = response.pageSize;
      this.totalRecords = response.totalRecords;
      this.totalPages = response.totalPages;
    });
  }

  onPageChange(newPage: number): void {
    this.pageNumber = newPage;
    this.getBookingHistory();
  }
}
