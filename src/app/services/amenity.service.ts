import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AmenityService {
  constructor(private http: HttpClient) {}

  getAllAmenities(
    pageNumber: number,
    pageSize: number,
    status?: string,
    searchTerm?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== '') {
      params = params.set('status', status);
    }

    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }

    // if (filter && filter.hotelId) {
    //   params = params.set('filter.hotelId', filter.hotelId.toString());
    // }

    return this.http.get(
      `${environment.BACKEND_API_URL}/api/Amenity`,
      { params }
    );
  }

  getAmenityDetails(amenityId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Amenity/amenity/${amenityId}`;
    return this.http.get(url);
  }

  getAmenitiesByRoomId(roomId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Amenity/room/${roomId}`;
    return this.http.get(url);
  }

  createAmenity(
    name: string,
    description: string,
    price: number,
    status: string,
    hotelId: number,
    capacity: number,
    inUse: number
  ): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Amenity`;
    const body = { name, description, price, status, hotelId, capacity, inUse };
    return this.http.post(url, body);
  }

  updateAmenity(
    amenityId: number,
    name: string,
    description: string,
    price: number,
    capacity: number,
    inUse: number
  ): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/amenity?amenityId=${amenityId}&name=${name}&description=${description}&price=${price}&capacity=${capacity}&inUse=${inUse}`;
    return this.http.put(url, {});
  }

  updateAmenityStatus(amenityId: number, status: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/amenity/status?amenityId=${amenityId}&status=${status}`;
    return this.http.put(url, {});
  }

  deleteAmenity(amenityId: number): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/amenity/${amenityId}`;
    return this.http.delete(url);
  }
}
