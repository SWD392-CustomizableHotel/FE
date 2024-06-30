import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { User } from '../interfaces/models/user';
import { Auth } from '../../assets/constants/constants';
import { Observable } from 'rxjs';
import { BaseResponse } from '../interfaces/models/base-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.BACKEND_API_URL}/${Auth.AUTH}/${Auth.USER}`
    );
  }

  updateProfile(profileData: any): Observable<BaseResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<BaseResponse<any>>(
      `${environment.BACKEND_API_URL}/api/User/update-profile`,
      profileData,
      { headers }
    );
  }

  getProfile(userId: string): Observable<any> {
    return this.http.get<any>(
      `${environment.BACKEND_API_URL}/api/User/profile/${userId}`
    );
  }
}
