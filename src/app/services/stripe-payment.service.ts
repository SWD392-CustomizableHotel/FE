import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  constructor(private http: HttpClient) { }

  createStripePayment(id?: string, amount?: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/StripePayments/create-payment-intent?Id=${id}&Amount=${amount}`;
    return this.http.post(url, {
      'items': [
        {
          'id': id,
          'amount': amount
        }
      ]
    });
  }
}
