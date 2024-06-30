import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../assets/environments/environment';
import { User } from '../interfaces/models/user';
import { BaseResponse } from '../interfaces/models/base-response';
import { ResetPasswordRequest } from '../interfaces/models/reset-password-request';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<any>(`${environment.BACKEND_API_URL}/api/Auth/login`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          if (user.isSucceed) {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
          }
          throw new Error('Login failed');
        })
      );
  }

  register(payload: any): Observable<BaseResponse<User>> {
    return this.http
      .post<BaseResponse<User>>(
        `${environment.BACKEND_API_URL}/api/Auth/register`,
        payload
      )
      .pipe(
        map((response) => {
          if (!response.isSucceed) {
            throw new Error(response.message);
          }
          return response;
        })
      );
  }

  logOut(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  forgotPassword(email: string): Observable<BaseResponse<User>> {
    return this.http
      .post<BaseResponse<User>>(
        `${environment.BACKEND_API_URL}/api/Auth/forgot-password`,
        { email }
      )
      .pipe(
        map((response) => {
          if (!response.isSucceed) {
            throw new Error(response.message);
          }
          return response;
        })
      );
  }

  resetPassword(
    resetPasswordRequest: ResetPasswordRequest
  ): Observable<BaseResponse<User>> {
    return this.http
      .post<BaseResponse<User>>(
        `${environment.BACKEND_API_URL}/api/Auth/reset-password`,
        resetPasswordRequest
      )
      .pipe(
        map((response) => {
          if (!response.isSucceed) {
            throw new Error(response.message);
          }
          return response;
        })
      );
  }

  updateUserProfile(
    userId: string,
    profileData: any
  ): Observable<BaseResponse<any>> {
    const url = `${environment.BACKEND_API_URL}/api/Auth/updateProfile`;
    const updateProfileCommand = {
      userId,
      userProfile: profileData,
    };
    return this.http.post<BaseResponse<any>>(url, updateProfileCommand);
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.sub || null; // Assuming 'sub' contains the user ID
    }
    return null;
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
}
