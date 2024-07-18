import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private http: HttpClient) { }

  getAllHotels(): Observable<any> {
    return this.http.get<any>(`${environment.BACKEND_API_URL}/api/hotel`, {});
  }
}
