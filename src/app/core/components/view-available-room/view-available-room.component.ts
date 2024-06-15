import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/view.room.service';
import { Room } from '../../../interfaces/models/room';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-available-room',
  templateUrl: './view-available-room.component.html',
  styleUrls: ['./view-available-room.component.scss'],
})
export class ViewAvailableRoomComponent implements OnInit {
  rooms?: Room[];
  filterText: string = '';
  filteredRooms?: Room[];
  sortType?: string[];
  selectedSortType?: string;

  constructor(
    public layoutService: LayoutService,
    public router: Router,
    private roomService: ApiService
  ) {}

  ngOnInit(): void {
    this.sortType = ['Price Low To High', 'Price High To Low'];
    this.roomService.getAvailableRoom().subscribe(
      (response: Room[]) => {
        this.rooms = response;
        this.filteredRooms = response;
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  filterRooms(): void {
    let rooms = this.rooms || [];
    if (this.filterText) {
      rooms = rooms.filter(room =>
        room.type?.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    if (this.selectedSortType) {
      if (this.selectedSortType === 'Price Low To High') {
        rooms.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      } else if (this.selectedSortType === 'Price High To Low') {
        rooms.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      }
    }

    this.filteredRooms = rooms;
  }
}
