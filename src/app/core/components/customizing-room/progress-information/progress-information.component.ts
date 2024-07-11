import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AmenitiesPackage } from '../../../../interfaces/models/amenities-package';
import { HotelService } from '../../../../services/hotel.service';
import { Hotel } from '../../../../interfaces/models/hotels';
import { RoomSize } from '../../../../interfaces/models/room-size';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Room } from '../../../../interfaces/models/room';
import { CustomizingRoomService } from '../../../../services/customizing-room.service';
import { CustomizeDataService } from '../../../../services/customize-data.service';

@Component({
  selector: 'app-progress-information',
  templateUrl: './progress-information.component.html',
  styleUrls: ['./progress-information.component.scss'],
  providers: [MessageService],
})
export class ProgressInformationComponent implements OnInit {
  @Input() activeIndex: number = 0;
  @Output() changeActiveIndex = new EventEmitter<number>();
  @Output() amenitiesChanged = new EventEmitter<string>();
  @Output() roomSizeChanged = new EventEmitter<string>();
  @Output() roomSelected = new EventEmitter<Room>();
  @Output() dateRange = new EventEmitter<Date[]>();

  amenitiesPackage: AmenitiesPackage[] | undefined;
  roomSizes!: RoomSize[];
  hotelLocations!: Hotel[];
  form: FormGroup;
  numberOfRoom: number = 1;
  numberOfAdult: number = 1;
  numberOfChildren: number = 0;
  value: number = 5;
  showSliders: boolean = false;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  roomList: Room[] = [];
  loading: boolean = false;

  selectedAmenitiesPackage?: AmenitiesPackage;
  selectedRoomSize?: RoomSize;


  constructor(
    private hotelService: HotelService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private roomService: CustomizingRoomService,
    private customizeDataService: CustomizeDataService
  ) {
    this.form = this.fb.group({
      hotel: ['', Validators.required],
      dateRange: ['', Validators.required],
      roomSize: ['', Validators.required],
      amenities: ['', Validators.required],
      numberOfRoom: [],
      numberOfAdult: [],
      numberOfChildren: [],
    });

    this.form.get('numberOfRoom')?.valueChanges.subscribe((value) => {
      this.numberOfRoom = value;
    });
    this.form.get('numberOfAdult')?.valueChanges.subscribe((value) => {
      this.numberOfAdult = value;
    });
    this.form.get('numberOfChildren')?.valueChanges.subscribe((value) => {
      this.numberOfChildren = value;
    });
  }

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const nextYear = year + 1;

    this.minDate = new Date();

    this.maxDate = new Date();
    this.maxDate.setFullYear(nextYear);

    this.roomSizes = [
      { label: 'Small (≤ 2 people)', value: 'small' },
      { label: 'Medium (≤ 4 people)', value: 'medium' },
      { label: 'Large (≥ 4 people)', value: 'large' },
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
      },
    });
    this.selectedAmenitiesPackage = this.amenitiesPackage[0];
    this.selectedRoomSize = this.roomSizes[0];
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleSliders();
    }
  }

  onSearch(): void {
    this.loading = true;
    if (this.numberOfAdult + this.numberOfChildren > 8) {
      this.messageService.clear();
      this.messageService.add({
        key: '2',
        severity: 'error',
        summary: 'Invalid',
        detail: `Number of children and adults must be lower than 8`,
      });
      this.loading = false;
      return;
    }
    if (!this.form.valid) {
      this.messageService.add({
        key: '2',
        severity: 'error',
        summary: 'Invalid',
        detail: `Please fill out your information.`,
      });
      this.loading = false;
    } else {
      this.roomService
        .getAvailableCustomizableRoom(
          this.selectedRoomSize?.value as string,
          this.numberOfAdult + this.numberOfChildren
        )
        .subscribe({
          next: (response) => {
            this.roomList = response.results!;
            this.loading = false;
            if (this.roomList) {
              window.scrollTo({
                top: 650,
                left: 0,
                behavior: 'smooth'
              });
            }
          },
          error: () => {
            this.loading = false;
          },
        });
    }
  }

  changeAmenities(value: string): void {
    this.amenitiesChanged.emit(value);
  }

  changeRoomSize(size: string): void {
    switch (size) {
      case 'small':
        this.selectedRoomSize = this.roomSizes[0];
        break;
      case 'medium':
        this.selectedRoomSize = this.roomSizes[1];
        break;
      case 'large':
        this.selectedRoomSize = this.roomSizes[2];
        break;
    }
    this.roomSizeChanged.emit(size);
  }

  toggleSliders(): void {
    this.showSliders = !this.showSliders;
  }

  randomNumber(): number {
    return Math.floor((Math.random() * 100) + 1);
  }

  checkPeopleCount(): void {
    if (this.numberOfAdult + this.numberOfChildren > 8) {
      this.messageService.clear('peopleCount');
      this.messageService.add({
        key: 'peopleCount',
        severity: 'error',
        summary: 'Error',
        detail: 'Adult + Children must be smaller than 8',
      });
    }
  }

  navigateToCustomizingSection(index: number, room: Room): void {
    const dateRange = this.form.get('dateRange')?.value;
    this.roomSelected.emit(room);
    this.dateRange.emit(dateRange);
    this.changeActiveIndex.emit(index);
    this.customizeDataService.setNumberOfRooms(this.numberOfRoom);
    window.scrollTo({
      top: 80,
      left: 0,
      behavior: 'smooth'
    });
  }
}
