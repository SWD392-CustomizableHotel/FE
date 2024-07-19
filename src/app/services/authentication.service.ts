import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/models/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../assets/constants/constants';
import { BaseResponse } from '../interfaces/models/base-response';
import { ResetPasswordRequest } from '../interfaces/models/reset-password-request';
import { environment } from '../../assets/environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

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
    const storedUser = JSON.parse(localStorage.getItem('user')!);
    if (storedUser?.token) {
      const decodedToken: any = jwtDecode(storedUser.token);
      storedUser.firstName = decodedToken.FirstName;
      storedUser.lastName = decodedToken.LastName;
      storedUser.email = decodedToken.email; // Assuming the email claim is present in the token
    }
    this.userSubject = new BehaviorSubject<User | null>(storedUser);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  public setUserValue(user: User | null): void {
    this.userSubject.next(user);
  }

  register(payload: any): Observable<BaseResponse<User>> {
    return this.http.post<BaseResponse<User>>(
      `${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.REGISTER}`,
      payload
    );
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<any>(
        `${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.LOGIN}`,
        {
          username,
          password,
        }
      )
      .pipe(
        map((user) => {
          if (user.isSucceed) {
            const decodedToken: any = jwtDecode(user.token);
            user.firstName = decodedToken.FirstName;
            user.lastName = decodedToken.LastName;
            user.email = decodedToken.email; // Assuming the email claim is present in the token

            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
          }
          return user;
        })
      );
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('socialUser');
    this.userSubject.next(null);
    this.socialAuthService.signOut();
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<BaseResponse<User>> {
    return this.http.post<BaseResponse<User>>(
      `${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.FORGOT_PASSWORD}`,
      { email }
    );
  }

  resetPassword(
    resetPasswordRequest: ResetPasswordRequest
  ): Observable<BaseResponse<User>> {
    return this.http.post<BaseResponse<User>>(
      `${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.RESET_PASSWORD}`,
      resetPasswordRequest
    );
  }
}
