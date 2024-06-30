import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../interfaces/models/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../assets/constants/constants';
import { BaseResponse } from '../interfaces/models/base-response';
import { ResetPasswordRequest } from '../interfaces/models/reset-password-request';
import { environment } from '../../assets/environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );

    this.user = this.userSubject.asObservable();
    // this.loggedIn.next(!!localStorage.getItem('user'));
  }

  public get userValue(): User | null {
    return this.userSubject.value;
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

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<any>(`${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.LOGIN}`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // Store user details and JWT token in local storage to keep user logged in
          if (user.isSucceed) {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
          }
          return user;
        })
      );
  }

  logOut(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.socialAuthService.signOut();
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<BaseResponse<User>> {
    return this.http
      .post<any>(
        `${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.FORGOT_PASSWORD}`,
        { email }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  resetPassword(
    resetPasswordRequest: ResetPasswordRequest
  ): Observable<BaseResponse<User>> {
    return this.http
      .post<any>(
        `${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.RESET_PASSWORD}`,
        resetPasswordRequest
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
