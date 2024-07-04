import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.BACKEND_API_URL}/api/booking/history`;
  constructor(private http: HttpClient) { }
  getBookingHistory(pageNumber: number, pageSize: number, roomType?: string, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get(this.apiUrl, { params });
  }
}
