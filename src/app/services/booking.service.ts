import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

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
