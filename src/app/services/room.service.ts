import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRooms(pageNumber: number, pageSize: number, roomStatus?: string, roomType?: string, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
      if (roomStatus && roomStatus !== '') {
        params = params.set('RoomStatus', roomStatus);
      }
      if (roomType && roomType !== '') {
        params = params.set('RoomType', roomType);
      }
      if (searchTerm && searchTerm !== '') {
        params = params.set('searchTerm', searchTerm);
      }
      return this.http.get(`${environment.BACKEND_API_URL}/get-rooms`, { params });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRoomDetails(roomId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/get-room-details/${roomId}`;
    return this.http.get(url);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editRoomDetails(roomId: number, type: string, price: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/edit-room-details/${roomId}?type=${type}&price=${price}`;
    return this.http.put(url, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateRoomStatus(roomId: number, status: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/update-room-status?roomId=${roomId}&status=${status}`;
    return this.http.put(url, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteRoom(roomId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/delete-room/${roomId}`;
    return this.http.delete(url);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createRoom(type: string, price: number, description: string, status: string, roomNumber: string, hotelId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/create-room?Type=${type}&Price=${price}&Description=${description}&Status=${status}&RoomNumber=${roomNumber}&HotelId=${hotelId}`;
    return this.http.post(url, {});
  }
}

