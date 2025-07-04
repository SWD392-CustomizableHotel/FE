import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../services/view.room.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { Room } from '../../../interfaces/models/room';
import { UserBookingService } from '../../../services/user-booking.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-booking-room',
  templateUrl: './booking-room.component.html',
  styleUrl: './booking-room.component.scss',
})
export class BookingRoomComponent implements OnInit, OnDestroy {
  selectedRoomId?: number;
  selectedRoom?: Room;
  rooms?: Room[];
  room?: Room;
  rangeDates?: Date[];
  formattedRangeDates?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    public router: Router,
    private userBookingData: UserBookingService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private websocketService: WebSocketService
  ) {}

  async ngOnInit(): Promise<void> {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    window.addEventListener('unload', this.handleUnload);
    window.addEventListener('popState', this.handleReturnButton);
    const idParam = this.route.snapshot.paramMap.get('id');
    this.selectedRoomId = idParam ? parseInt(idParam, 10) : NaN;

    // Fetch room details and wait for the response
    this.room = await this.roomService
      .getRoomDetails(this.selectedRoomId)
      .toPromise();

    this.userBookingData.currentRangeDates.subscribe((rangeDates) => {
      this.rangeDates = rangeDates;
      if(rangeDates === undefined) {
        const start =
          this.datePipe.transform(this.room!.startDate, 'dd/MM/yyyy') || '';
        this.startDate = start;
        const end = this.datePipe.transform(this.room!.endDate, 'dd/MM/yyyy') || '';
        this.endDate = end;
        this.formattedRangeDates = `${start} - ${end}`;
      }
      localStorage.setItem('rangeDate[0]', rangeDates[0]);
      localStorage.setItem('rangeDate[1]', rangeDates[1]);
      if (rangeDates && rangeDates.length === 2) {
        const start =
          this.datePipe.transform(rangeDates[0], 'dd/MM/yyyy') || '';
        this.startDate = start;
        const end = this.datePipe.transform(rangeDates[1], 'dd/MM/yyyy') || '';
        this.endDate = end;
        this.formattedRangeDates = `${start} - ${end}`;
      } else {
        this.formattedRangeDates = '';
      }
    });
  }
  toStripePayment(firstName?: string, lastName?: string, email?: string): void {
    if (this.selectedRoomId !== undefined) {
      localStorage.setItem('roomId', this.selectedRoomId.toString());
    } else {
      console.error('ID is undefined');
    }
    this.selectedRoom = this.rooms?.find(
      (room) => room.id === this.selectedRoomId
    );
    this.router.navigate([
      '/stripe-payment',
      this.selectedRoomId,
      firstName,
      lastName,
      email,
    ]);
  }

  onUpload(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with ID',
    });
  }

  handleBeforeUnload(e: any): void {
    e.preventDefault();
  }

  handleUnload() : void {
    if (localStorage.getItem('socket_connection') !== null) {
      this.websocketService.sendMessage(localStorage.getItem('socket_connection')!);
      localStorage.removeItem('socket_connection');
    }
  }

  handleReturnButton() : void {
    alert('Bỏ Nguyên luôn');
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event : any) : void {
    console.log(event);
    if(confirm('Are you sure ?')) {
      if (localStorage.getItem('socket_connection') !== null) {
        this.websocketService.sendMessage(localStorage.getItem('socket_connection')!);
        localStorage.removeItem('socket_connection');
      }
    } else {
      return;
    }
  }

  ngOnDestroy() : void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('unload', this.handleUnload);
  }
}
