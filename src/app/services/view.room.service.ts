import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room } from '../interfaces/models/room';
import { BaseResponse } from '../interfaces/models/base-response';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAvailableRoom(): Observable<Room[]> {
    return this.http.get<BaseResponse<Room[]>>(`${environment.BACKEND_API_URL}/api/ViewAvailableRoom/rooms`)
      .pipe(
        map(response => response?.result || [])
      );
  }
}
