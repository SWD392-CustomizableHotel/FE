import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../interfaces/models/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../assets/environments/environment';
import { Auth } from '../../assets/constants/constants';
import { BaseResponse } from '../interfaces/models/base-response';
import { ResetPasswordRequest } from '../interfaces/models/reset-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.post<any>(`${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.LOGIN}`, { username, password })
    .pipe(map((user) => {
      // Store user details and JWT token in local storage to keep user logged in
      if (user.isSucceed) {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }
    }));
  }

  logOut(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<BaseResponse<User>>  {
    return this.http.post<any>(`${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.FORGOT_PASSWORD}`, { email })
    .pipe(map((response) => {
      return response;
    }));
  }

  resetPassword(resetPasswordRequest: ResetPasswordRequest): Observable<BaseResponse<User>>  {
    return this.http.post<any>(`${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.RESET_PASSWORD}`, resetPasswordRequest)
    .pipe(map((response) => {
      return response;
    }));
  }
}
