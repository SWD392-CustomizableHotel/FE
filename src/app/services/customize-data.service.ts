import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomizeRequest } from '../interfaces/models/customize-request';

@Injectable({
  providedIn: 'root'
})
export class CustomizeDataService {
  private customizeRequestSource = new BehaviorSubject<CustomizeRequest | null>(null);
  customizeRequest$ = this.customizeRequestSource.asObservable();

  private numberOfRooms = new BehaviorSubject<number>(0);
  numberOfRoomObs$ = this.numberOfRooms.asObservable();

  private canvasBlobImage = new BehaviorSubject<Blob | null>(null);
  canvasBlobImageObst$ = this.canvasBlobImage.asObservable();

  private dateRangeSubject = new BehaviorSubject<Date[]>([]);
  dateRangeObs$ = this.dateRangeSubject.asObservable();

  setCustomizeRequest(request: CustomizeRequest): void {
    this.customizeRequestSource.next(request);
  }

  getCustomizeRequest(): CustomizeRequest | null {
    return this.customizeRequestSource.value;
  }

  setDateRange(request: Date[]): void {
    this.dateRangeSubject.next(request);
  }

  getDateRange(): Date[] {
    return this.dateRangeSubject.value;
  }

  setCanvasBlobImage(blob: Blob): void {
    this.canvasBlobImage.next(blob);
  }

  getCanvasBlobImage(): Blob | null {
    return this.canvasBlobImage.value;
  }

  setNumberOfRooms(request: number): void {
    this.numberOfRooms.next(request);
  }

  getNumberOfRooms(): number {
    return this.numberOfRooms.value;
  }
}
