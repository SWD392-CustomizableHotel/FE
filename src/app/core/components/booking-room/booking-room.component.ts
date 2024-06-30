import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../services/view.room.service';
import { Room } from '../../../interfaces/models/rooms';
import { UserBookingService } from '../../../services/user-booking.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-booking-room',
  templateUrl: './booking-room.component.html',
  styleUrl: './booking-room.component.scss'
})
export class BookingRoomComponent implements OnInit {
  selectedRoomId?: number;
  selectedRoom?: Room;
  rooms?: Room[];
  room?: Room;
  rangeDates?: Date[];
  formattedRangeDates?: string;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    public router : Router,
    private userBookingData: UserBookingService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.selectedRoomId = idParam ? parseInt(idParam, 10) : NaN;
    this.roomService.getRoomDetails(this.selectedRoomId).subscribe(
      (response: Room) => {
        console.log(response);
        this.room = response;
      }
    );
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
    });
  }

  toStripePayment(id?: number): void {
    this.selectedRoomId = id;
    this.selectedRoom = this.rooms?.find((room) => room.roomId === id);
    this.router.navigate(['/stripe-payment', id]);
  }
}

