import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { FPTResponse, IdentityCardDto } from '../interfaces/models/identity-card';

@Injectable({
  providedIn: 'root',
})
export class IdentityCardService {
  constructor(private http: HttpClient) {}

  uploadIdentityCard(formData: FormData): Observable<BaseResponse<FPTResponse>> {
    const url = `${environment.BACKEND_API_URL}/api/IdentityCard/upload-identity-card`;
    return this.http.post<BaseResponse<FPTResponse>>(url, formData);
  }

  getAllIdentityCards(): Observable<BaseResponse<IdentityCardDto[]>> {
    const url = `${environment.BACKEND_API_URL}/api/IdentityCard/get-all-identity-cards`;
    return this.http.get<BaseResponse<IdentityCardDto[]>>(url);
  }

}
