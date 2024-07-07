import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HotelServicesService {
  constructor(private http: HttpClient) {}

  getAllService(
    pageNumber: number,
    pageSize: number,
    serviceName?: string,
    searchTerm?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (serviceName && serviceName !== '') {
      params = params.set('ServiceName', serviceName);
    }
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get<any>(`${environment.BACKEND_API_URL}/api/AssignService`, {
      params,
    });
  }
}
