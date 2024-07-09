import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../interfaces/models/room';
import { environment } from '../../assets/environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class CustomizingRoomService {

  constructor(private http: HttpClient) { }

  getAvailableCustomizableRoom(size: string, numberOfPeople: number): Observable<BaseResponse<Room>> {
    return this.http.post<BaseResponse<Room>>(`${environment.BACKEND_API_URL}/api/CustomizingRoom/get-all`, { 'roomSize': size, numberOfPeople });
  }
}
