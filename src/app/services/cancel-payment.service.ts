import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CancelPaymentService {

  constructor(private http: HttpClient) { }

  cancelPayment(clientSecret?: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/StripePayments/cancel-payment`;
    return this.http.post(url, {
          'clientSecret': clientSecret,
    });
  }
}
