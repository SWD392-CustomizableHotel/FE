import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  selectedRoomId?: number;
  selectedUserId?: number;
  rangeDates?: Date[];

  constructor(private http: HttpClient) { }

  saveSelectedRoomId(selectedRoomId?: number) : void {
    this.selectedRoomId = selectedRoomId;
  }
  saveSelectedUserId(selectedUserId?: number) : void {
    this.selectedUserId = selectedUserId;
  }
  saveRangeDates(rangeDates?: Date[]) : void {
    this.rangeDates = rangeDates;
  }

  getSelectedRoomId() : number {
    if (this.selectedRoomId === undefined) {
      throw new Error('Selected room ID is undefined');
    }
    return this.selectedRoomId;
  }

  getSelectedUserId() : number {
    if (this.selectedUserId === undefined) {
      throw new Error('Selected user ID is undefined');
    }
    return this.selectedUserId;
  }
  getRangeDates() : Date[] {
    if (this.rangeDates === undefined) {
      throw new Error('Range Dates is undefined');
    }
    return this.rangeDates;
  }

  createBooking(bookingCode?: string, rating?: number, roomId?: number, userId?: number, startDate?: Date, endDate?:Date): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Booking/create-booking`;
    return this.http.post(url, {
          'code': bookingCode,
          'rating': rating,
          'roomId': roomId,
          'userId': userId,
          'startDate' : startDate,
          'endDate' : endDate
    });
  }
}
