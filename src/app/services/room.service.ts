import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../assets/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getRooms(
    pageNumber: number,
    pageSize: number,
    roomStatus?: string,
    roomType?: string,
    searchTerm?: string
  ): Observable<any> {
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
    return this.http.get(`${environment.BACKEND_API_URL}/api/Room`, {
      params,
    });
  }
  getRoomDetails(roomId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Room/${roomId}`;
    return this.http.get(url);
  }

  editRoomDetails(
    roomId: number,
    type: string,
    price: number,
    imageFile?: File
  ): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/room/${roomId}`;
    const formData = new FormData();

    if (imageFile) {
      formData.append('ImageFile', imageFile, imageFile.name);
    }

    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('No user found in localStorage');
      return throwError('User not authenticated');
    }

    const user = JSON.parse(userString);
    if (!user || !user.token) {
      console.error('Invalid user token');
      return throwError('User not authenticated');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    const params = new HttpParams()
      .set('type', type)
      .set('price', price.toString());

    return this.http.put(url, formData, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error editing room details', error);
        return throwError(error);
      })
    );
  }

  updateRoomStatus(roomId: number, status: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/room/status?roomId=${roomId}&status=${status}`;
    return this.http.put(url, {});
  }

  deleteRoom(roomId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/room/${roomId}`;
    return this.http.delete(url);
  }

  createRoom(
    type: string,
    price: number,
    description: string,
    status: string,
    hotelId: number,
    imageFile: File,
    roomSize: string,
    startDate: string,
    endDate: string,
    numberOfPeople: number
  ): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/room`;
    const formData = new FormData();

    formData.append('Type', type);
    formData.append('Price', price.toString());
    formData.append('Description', description);
    formData.append('Status', status);
    formData.append('HotelId', hotelId.toString());
    formData.append('ImageUpload', imageFile, imageFile.name);
    formData.append('RoomSize', roomSize); // Added RoomSize to formData
    formData.append('StartDate', startDate); // Added StartDate to formData
    formData.append('EndDate', endDate); // Added EndDate to formData
    formData.append('NumberOfPeople', numberOfPeople.toString());

    const user = JSON.parse(localStorage.getItem('user')!);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    return this.http.post(url, formData, { headers });
  }
}
