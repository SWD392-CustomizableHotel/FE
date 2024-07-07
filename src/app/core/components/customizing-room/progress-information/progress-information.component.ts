import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-progress-information',
  templateUrl: './progress-information.component.html',
  styleUrls: ['./progress-information.component.scss'],
})
export class ProgressInformationComponent {
  @Input() activeIndex: number = 0;
  @Output() changeActiveIndex = new EventEmitter<number>();

  hotelLocations = [
    { name: 'Location 1', code: 'LOC1' },
    { name: 'Location 2', code: 'LOC2' },
  ];

  roomSizes = [
    { label: 'Small (178x324)', value: 'small' },
    { label: 'Medium (204x398)', value: 'medium' },
    { label: 'Large (288x451)', value: 'large' },
  ];

  amenitiesPackages = [
    { label: 'Basic', value: 'basic' },
    { label: 'Premium', value: 'premium' },
    { label: 'Family', value: 'family' },
  ];

  changeProgressIndex(index: number): void {
    this.changeActiveIndex.emit(index);
  }
}
