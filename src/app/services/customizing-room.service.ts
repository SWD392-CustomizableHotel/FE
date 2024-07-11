import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../interfaces/models/room';
import { environment } from '../../assets/environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { Amenity } from '../interfaces/models/amenity';
import { CustomizeRequest } from '../interfaces/models/customize-request';
import { CustomizeBooking } from '../interfaces/models/customize-booking';
import { Payment } from '../interfaces/models/payment';

@Injectable({
  providedIn: 'root',
})
export class CustomizingRoomService {
  constructor(private http: HttpClient) {}

  getAvailableCustomizableRoom(
    size: string,
    numberOfPeople: number
  ): Observable<BaseResponse<Room>> {
    return this.http.post<BaseResponse<Room>>(
      `${environment.BACKEND_API_URL}/api/CustomizingRoom/get-all`,
      { roomSize: size, numberOfPeople }
    );
  }

  getAmenityByType(type: string): Observable<BaseResponse<Amenity>> {
    return this.http.get<BaseResponse<Amenity>>(
      `${environment.BACKEND_API_URL}/api/CustomizingRoom/get-amenity/${type}`
    );
  }

  createStripePayment(
    request: CustomizeRequest
  ): Observable<BaseResponse<string>> {
    const url = `${environment.BACKEND_API_URL}/api/CustomizingRoom/create-payment-intent`;
    return this.http.post<BaseResponse<string>>(url, {
      items: [
        {
          roomId: request.roomId,
          roomPrice: request.roomPrice,
          amenityId: request.amenityId,
          amenityPrice: request.amenityPrice,
          numberOfDay: request.numberOfDay,
          numberOfRoom: request.numberOfRoom,
        },
      ],
    });
  }

  createRoomBookingAndAmenityBooking(
    request: CustomizeBooking
  ): Observable<BaseResponse<string>> {
    const url = `${environment.BACKEND_API_URL}/api/CustomizingRoom/booking`;
    return this.http.post<BaseResponse<string>>(url, request);
  }

  uploadCanvasAndUpdateRoomStatus(
    canvasImage: Blob,
    roomId: number
  ): Observable<BaseResponse<string>> {
    const formData = new FormData();
    formData.append('canvasImage', canvasImage);
    formData.append('roomId', roomId.toString());

    const url = `${environment.BACKEND_API_URL}/api/CustomizingRoom/update-room`;
    return this.http.post<BaseResponse<string>>(url, formData);
  }

  createPayment(payment: Payment): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Payment/create-payment`;
    return this.http.post(url, payment);
  }
}
