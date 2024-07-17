import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from '../interfaces/models/room';
import { BaseResponse } from '../interfaces/models/base-response';
import { environment } from '../../assets/environments/environment';
import { Hotel } from '../interfaces/models/hotels';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  getAvailableRoom(): Observable<Room[]> {
    return this.http.get<BaseResponse<Room>>(`${environment.BACKEND_API_URL}/api/ViewAvailableRoom/rooms`)
      .pipe(
        map(response => {
          const results = response.results || [];
          return results;
        })
      );
  }
  getRoomDetails(roomId: number): Observable<any> {
    return this.http.get<BaseResponse<Room>>(`${environment.BACKEND_API_URL}/get-room-details/${roomId}`)
      .pipe(
        map(response => response?.data || [])
      );
  }
  getHotel(): Observable<Hotel[]> {
    return this.http.get<BaseResponse<Hotel[]>>(`${environment.BACKEND_API_URL}/get-hotels`, {})
      .pipe(
        map(response => response?.data || [])
      );
  }
}
