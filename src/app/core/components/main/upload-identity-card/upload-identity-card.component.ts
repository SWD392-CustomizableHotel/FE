import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Payment } from '../../../../interfaces/models/payment';
import { BookingService } from '../../../../services/booking.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { IdentityCardService } from '../../../../services/identity-card.service';
import { PaymentService } from '../../../../services/payment.service';
import { CombinedBookingHistoryDto } from '../../../../interfaces/models/combined-booking-dto';
import { RoomService } from '../../../../services/view.room.service';
import { Room } from '../../../../interfaces/models/room';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-upload-identity-card',
  templateUrl: './upload-identity-card.component.html',
  providers: [MessageService, DialogService]
})
export class UploadIdentityCardComponent implements OnInit {
  paymentDialogVisible: boolean = false;
  selectedPayment: Payment[] = [];
  selectedBooking: CombinedBookingHistoryDto  | null = null;
  selectedUserId?: string;
  selectedRoom: Room | null = null;
  bookings: CombinedBookingHistoryDto [] = [];
  availableRoomsDialogVisible: boolean = false;
  loading: boolean = true;
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;
  searchTerm?: string;
  selectedRoomType: { type: string } | undefined;
  cols: any[] = [];
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;
  bookingId: number | null = null;
  startDate?: any;
  endDate?: any;
  selectedRoomId?: number;
  email?: string;
  firstName?: string;
  rooms?: Room[];
  bookingCode?: string;
  paymentIntentId?: number;
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

  constructor(
    private bookingService: BookingService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private identityCardService: IdentityCardService,
    private paymentService: PaymentService,
    private roomService: RoomService,
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'roomDescription', header: 'Room Description' },
      { field: 'userName', header: 'User Name' },
      { field: 'identityCard.fullName', header: 'Full Name' },
      { field: 'identityCard.cardNumber', header: 'Card Number' },
      { field: 'identityCard.dateOfBirth', header: 'Date of Birth' },
      { field: 'startDate', header: 'Check In Date' },
      { field: 'payments', header: 'Payments' }
    ];
    this.loadBookings(1, this.rows, this.searchTerm);
  }

  private loadBookings(pageNumber: number, pageSize: number, roomType?: string, searchTerm?: string): void {
    this.loading = true;
    this.bookingService.getBookingByStartDate(pageNumber, pageSize, roomType, searchTerm)
      .subscribe({
        next: (data) => {
          this.bookings = data.data
          .map((booking : CombinedBookingHistoryDto ) => {
            return {
              ...booking,
              roomType: this.roomTypeOptions.find(
                (option) => option.type === booking.roomType
              )?.type,
            };
          })
          .sort((a: {bookingId : number}, b: {bookingId : number}) => b.bookingId - a.bookingId);
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
    this.loadBookings(1, this.rows, this.searchTerm);
  }

  onRowsChange(newRows: number): void {
    this.rows = newRows;
    this.first = 0;
    this.loadBookings(1, this.rows, this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const pageNumber = Math.floor(this.first / this.rows) + 1;
    this.loadBookings(pageNumber, this.rows, this.searchTerm);
  }

  clear(table: Table): void {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = undefined;
    this.loadBookings(1, this.rows, this.searchTerm);
  }

  openPaymentDialog(payment: Payment[], booking: CombinedBookingHistoryDto ): void {
    this.selectedPayment = payment;
    this.selectedBooking = booking;
    this.paymentDialogVisible = true;
  }

  closePaymentDialog() : void {
    this.paymentDialogVisible = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.files[0];
    this.uploadedFiles = event.files;
  }

  fetchPaymentAndUpload(): void {
    if (!this.selectedBooking || !this.selectedBooking.bookingId) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Booking ID is missing' });
        return;
    }

    this.paymentService.getPaymentByBookingId(this.selectedBooking.bookingId)
        .subscribe({
            next: (response) => {
                const paymentId = response.data?.id;
                if (paymentId) {
                    this.uploadFile(paymentId);
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Payment ID is missing' });
                }
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch payment' });
            }
        });
}

  uploadFile(paymentId: number): void {
    if (this.selectedFile && paymentId) {
      const formData = new FormData();
      formData.append('frontFile', this.selectedFile);
      formData.append('paymentId', paymentId.toString());

      this.identityCardService.uploadIdentityCard(formData).subscribe({
        next: (response) => {
          if (response.data) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Image uploaded successfully!' });
            this.loadBookings(1, this.rows, this.searchTerm);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Image upload failed!' });
          }
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Image upload failed!' });
        }
      });
    } else {
      if (!this.selectedFile) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select an image to upload' });
      } else if (!paymentId) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Payment ID is missing' });
      }
    }
  }

  openAvailableRoomsDialog(): void {
    this.roomService.getAvailableRoom().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.availableRoomsDialogVisible = true;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load available rooms' });
      }
    });
  }

  closeAvailableRoomsDialog(): void {
    this.availableRoomsDialogVisible = false;
  }

  bookForLater(roomId: number): void {
    this.bookingCode = 'B_' + Date.now();
    localStorage.setItem('roomId', roomId.toString());

    this.roomService.getRoomDetails(roomId).subscribe({
      next: (room: Room) => {
        const price = room.price;

        this.bookingService.createBooking(this.bookingCode).subscribe(
          (bookingResponse: any) => {
            const bookingId = bookingResponse.data;

            this.paymentService
              .createPaymentForLater(this.bookingCode, price, bookingId, 'Not Yet')
              .subscribe(
                (response: any) => {
                  console.log('Payment Intent created for later:', response);
                  this.paymentIntentId = response.data;

                  this.messageService.add({
                    severity: 'success',
                    summary: 'Booking Created',
                    detail: 'Your booking has been created.',
                  });

                  this.paymentService.updateRoomStatusAfterBooking().subscribe({
                    next: (response2: any) => {
                      console.log(response2);
                      this.messageService.add({
                        severity: 'success',
                        summary: 'Room Status Updated',
                        detail: 'Room status updated successfully.',
                      });
                    },
                    error: (error2: any) => {
                      console.error('Error updating room status:', error2);
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Room Status Update Failed',
                        detail: 'Failed to update room status. Please try again.',
                      });
                    }
                  });
                },
                (error: any) => {
                  console.error('Error creating payment for later:', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Payment Failed',
                    detail: 'Failed to create the payment. Please try again.',
                  });
                }
              );
          },
          (error: any) => {
            console.error('Error creating booking:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Booking Failed',
              detail: 'Failed to create the booking. Please try again.',
            });
          }
        );
      },
      error: (error: any) => {
        console.error('Error fetching room details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Room Fetch Failed',
          detail: 'Failed to fetch room details. Please try again.',
        });
      }
    });
  }
}