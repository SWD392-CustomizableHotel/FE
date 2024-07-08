import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AmenitiesPackage } from '../../../../interfaces/models/amenities-package';
import { HotelService } from '../../../../services/hotel.service';
import { Hotel } from '../../../../interfaces/models/hotels';
import { RoomSize } from '../../../../interfaces/models/room-size';

@Component({
  selector: 'app-progress-information',
  templateUrl: './progress-information.component.html',
  styleUrls: ['./progress-information.component.scss'],
})
export class ProgressInformationComponent implements OnInit {
  @Input() activeIndex: number = 0;
  @Output() changeActiveIndex = new EventEmitter<number>();
  @Output() amenitiesChanged = new EventEmitter<string>();
  @Output() roomSizeChanged = new EventEmitter<string>();
  amenitiesPackage: AmenitiesPackage[] | undefined;
  roomSizes: RoomSize[] | undefined;
  hotelLocations: Hotel[] | undefined;

  selectedAmenitiesPackage: AmenitiesPackage | undefined;
  selectedRoomSize: RoomSize | undefined;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.roomSizes = [
      { label: 'Small (178x324)', value: 'small' },
      { label: 'Medium (204x398)', value: 'medium' },
      { label: 'Large (288x451)', value: 'large' },
    ];
    this.amenitiesPackage = [
      { label: 'Basic', value: 'basic' },
      { label: 'Advanced', value: 'advanced' },
      { label: 'Family', value: 'family' },
    ];
    this.hotelService.getAllHotels().subscribe({
      next: (res) => {
        this.hotelLocations = res.data;
      },
      error: () => {
        this.hotelLocations = [];
      }
    });
    this.selectedAmenitiesPackage = this.amenitiesPackage.at(0);
    this.selectedRoomSize = this.roomSizes.at(0);
  }

  changeProgressIndex(index: number): void {
    this.changeActiveIndex.emit(index);
  }

  changeAmenities(value: string): void {
    this.amenitiesChanged.emit(value);
  }

  changeRoomSize(size: string): void {
    this.roomSizeChanged.emit(size);
  }
}
