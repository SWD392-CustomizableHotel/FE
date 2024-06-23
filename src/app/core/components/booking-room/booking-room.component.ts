import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../../services/view.room.service';
import { Room } from '../../../interfaces/models/rooms';
@Component({
  selector: 'app-booking-room',
  templateUrl: './booking-room.component.html',
  styleUrl: './booking-room.component.scss'
})
export class BookingRoomComponent implements OnInit {
  selectedRoomId?: number;
  room?: Room;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
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
  }
}

