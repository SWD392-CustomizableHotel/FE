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
}
