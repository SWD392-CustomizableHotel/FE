import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserBookingService {

  private locationSource = new BehaviorSubject<string>('');
  currentLocation = this.locationSource.asObservable();

  private rangeDatesSource = new BehaviorSubject<any>(null);
  currentRangeDates = this.rangeDatesSource.asObservable();

  private startDateSource = new BehaviorSubject<any>(null);
  currentStartDate = this.startDateSource.asObservable();

  private peopleCountSource = new BehaviorSubject<{ rooms: number, adults: number, children: number }>({ rooms: 0, adults: 0, children: 0 });
  currentPeopleCount = this.peopleCountSource.asObservable();

  getLocation(location: string | undefined) : void {
    if(location)
   this.locationSource.next(location);
  }

  getRangeDates(rangeDates: Date[]) : void {
      this.rangeDatesSource.next(rangeDates);
  }

  getStartDate(startDate: Date) : void {
    this.rangeDatesSource.next(startDate);
  }

  setRangeDates(rangeDates: Date[]): void {
    this.rangeDatesSource.next(rangeDates);
  }

  getPeopleCount(peopleCount: { rooms: number, adults: number, children: number }) :void {
    this.peopleCountSource.next(peopleCount);
  }
}
