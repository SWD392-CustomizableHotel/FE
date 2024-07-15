import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  selectedRoomId?: number;
  selectedUserId?: string;
  rangeDates?: Date[];

  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.BACKEND_API_URL}/api/booking/history`;
  private checkInUrl = `${environment.BACKEND_API_URL}/api/booking/check-in`;

  getBookingHistory(pageNumber: number, pageSize: number, roomType?: string, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get(this.apiUrl, { params });
  }

  getBookingByStartDate(pageNumber: number, pageSize: number, roomType?: string, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get(this.checkInUrl, { params });
  }

  createBooking(bookingCode?: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Booking/create-booking`;
    const roomId = localStorage.getItem('roomId');
    this.selectedRoomId = roomId ? parseInt(roomId) : undefined;
    const userId = localStorage.getItem('userId');
    if(userId) {
      this.selectedUserId = userId;
    }
    const rangeDate0 = localStorage.getItem('rangeDate[0]');
    const rangeDate1 = localStorage.getItem('rangeDate[1]');
    if(rangeDate0 && rangeDate1) {
      this.rangeDates = [new Date(Date.parse(rangeDate0)), new Date(Date.parse(rangeDate1))];
    }
    return this.http.post(url, {
          'code': bookingCode,
          'rating': 5,
          'roomId': this.selectedRoomId,
          'userId': this.selectedUserId,
          'startDate' : this.rangeDates![0],
          'endDate' : this.rangeDates![1]
    });
  }
}
