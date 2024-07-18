import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  constructor(private http: HttpClient) { }

  createStripePayment(roomId?: string, roomPrice?: number, numberOfDate?: number, numberOfRoom?: number, userEmail?: string, userName?: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/stripepayments/create-payment-intent`;
    return this.http.post(url, {
      'items': [
        {
          'roomId': roomId,
          'roomPrice': roomPrice,
          'numberOfDate': numberOfDate,
          'numberOfRoom': numberOfRoom,
          'userEmail' : userEmail,
          'userName' : userName
        }
      ]
    });
  }
}
