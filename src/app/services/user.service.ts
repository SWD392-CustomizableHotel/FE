import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { User } from '../interfaces/models/user';
import { Staff } from '../interfaces/models/service';
import { Auth } from '../../assets/constants/constants';
import { Observable } from 'rxjs';
import { BaseResponse } from '../interfaces/models/base-response';
import { Customer } from '../interfaces/models/customer';

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

  getProfile(email: string): Observable<BaseResponse<User>> {
    const url = `${environment.BACKEND_API_URL}/api/Auth/profile/${email}`;
    return this.http.get<BaseResponse<User>>(url);
  }

  updateProfile(profileData: any): Observable<BaseResponse<any>> {
    const url = `${environment.BACKEND_API_URL}/api/Auth/update-profile`;
    return this.http.post<BaseResponse<any>>(url, profileData);
  }

  getStaff(): Observable<Staff[]> {
    const url = `${environment.BACKEND_API_URL}/api/Services/get-staff`;
    return this.http.get<Staff[]>(url);
  }

  getCustomers(): Observable<Customer[]> {
    const url = `${environment.BACKEND_API_URL}/api/IdentityCard/get-customers`;
    return this.http.get<Customer[]>(url);
  }
}
