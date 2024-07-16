import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';
import { CheckOutCommand } from '../interfaces/models/CheckOutCommand';
import { BaseResponse } from '../interfaces/models/base-response';
import { CustomizeRequest } from '../interfaces/models/customize-request';
import { PaymentCommand } from '../interfaces/models/paymentCommand';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  selectedRoomId?: number;
  selectedUserId?: string;
  rangeDates?: Date[];

  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.BACKEND_API_URL}/api/booking/history`;
  private checkoutUrl = `${environment.BACKEND_API_URL}/api/booking/check-out`;
  getBookingHistory(pageNumber: number, pageSize: number, roomType?: string, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get(this.apiUrl, { params });
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
  checkout(pageNumber: number, pageSize: number, roomType?: string, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get(this.checkoutUrl, { params });
  }

  getCheckOutDetails(id: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Booking/${id}`;
    return this.http.get(url);
  }

  checkOutAction(bookingId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/booking/check-out`;
    const command: CheckOutCommand = { bookingId };
    return this.http.post(url, command);
  }

  paymentAction(bookingId: number, paymentMethod: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/booking/payment`;
    const command: PaymentCommand = { bookingId, paymentMethod };
    return this.http.post(url, command);
  }

  createStripePayment(
    request: CustomizeRequest
  ): Observable<BaseResponse<string>> {
    const url = `${environment.BACKEND_API_URL}/api/CustomizingRoom/create-payment-intent`;
    return this.http.post<BaseResponse<string>>(url, {
      items: [
        {
          roomId: request.roomId,
          roomPrice: request.roomPrice,
          amenityId: request.amenityId,
          amenityPrice: request.amenityPrice,
          numberOfDay: request.numberOfDay,
          numberOfRoom: request.numberOfRoom,
        },
      ],
    });
  }

}
