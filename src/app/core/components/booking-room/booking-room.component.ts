import { Component, OnInit } from '@angular/core';
import { Room } from '../../../interfaces/models/room';
import { RoomService } from '../../../services/view.room.service';
@Component({
  selector: 'app-booking-room',
  templateUrl: './booking-room.component.html',
  styleUrl: './booking-room.component.scss'
})
export class BookingRoomComponent implements OnInit {
  rooms?: Room[];
  filteredRooms?: Room[];

  constructor(
    private roomService: RoomService,
  ) {}

  ngOnInit(): void {
    this.roomService.getAvailableRoom().subscribe(
      (response: Room[]) => {
        this.rooms = response;
        this.filteredRooms = response;
      }
    );
  }
}

