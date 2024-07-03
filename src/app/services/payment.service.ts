import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPayment(paymentCode?: string, amount?: number, status?: string, paymentIntentId?: number, bookingId?: number, startDate?: Date, endDate?:Date): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Payment/create-payment`;
    return this.http.post(url, {
          'code': paymentCode,
          'amount': amount,
          'status': status,
          'paymentIntentId': paymentIntentId,
          'bookingId' : bookingId,
          'startDate' : startDate,
          'endDate' : endDate
    });
  }
}
