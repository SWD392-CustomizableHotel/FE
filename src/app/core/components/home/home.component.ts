import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/services/app.layout.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/view.room.service';
import { Room } from '../../../interfaces/models/room';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  rooms?: Room[];

  constructor(public layoutService: LayoutService, public router: Router, private roomService: ApiService) { }

  ngOnInit(): void {
    this.roomService.getAvailableRoom().subscribe(
      (response: Room[]) => {
        this.rooms = response;
        console.log('Rooms fetched successfully', this.rooms);
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }
}
