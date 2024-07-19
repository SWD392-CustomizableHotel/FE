import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendInvoiceService {

  constructor(private http: HttpClient) { }

  getInvoiceLink(paymentIntentId?: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/stripepayments/send-invoice-link`;
    return this.http.post(url, {
          'paymentIntentId': paymentIntentId,
    });
  }
}
