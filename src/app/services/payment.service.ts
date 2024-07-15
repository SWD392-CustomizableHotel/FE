import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  rangeDates?: Date[];
  paymentStatus?: string;
  selectedRoomId?: number;
  roomStatus?: string;

  constructor(private http: HttpClient) {
    this.paymentStatus = 'Success';
    this.roomStatus = 'Booked';
  }

  createPayment(paymentCode?: string, amount?: number, paymentIntentId?: string, bookingId?: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Payment/create-payment`;
    const rangeDate0 = localStorage.getItem('rangeDate[0]');
    const rangeDate1 = localStorage.getItem('rangeDate[1]');
    if(rangeDate0 && rangeDate1) {
      this.rangeDates = [new Date(Date.parse(rangeDate0)), new Date(Date.parse(rangeDate1))];
    }
    return this.http.post(url, {
          'code': paymentCode,
          'amount': amount,
          'status': this.paymentStatus,
          'paymentIntentId': paymentIntentId,
          'bookingId' : bookingId,
          'startDate' : this.rangeDates![0],
          'endDate' : this.rangeDates![1]
    });
  }

  updateRoomStatusAfterBooking(): Observable<any> {
    const roomId = localStorage.getItem('roomId');
    this.selectedRoomId = roomId ? parseInt(roomId) : undefined;
    const url = `${environment.BACKEND_API_URL}/update-room-status?roomId=${this.selectedRoomId}&status=${this.roomStatus}`;
    return this.http.put(url, {
      'roomId': this.selectedRoomId,
      'status': this.roomStatus
    });
  }

  getPaymentByBookingId(bookingId?: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Payment/get-payment?BookingId=${bookingId}`;
    return this.http.get<any>(url);
  }
}
