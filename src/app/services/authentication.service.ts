import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of } from 'rxjs';
import { User } from '../interfaces/models/user';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../assets/environments/environment.prod';
import { Auth } from '../../assets/constants/constants';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { BaseService } from '../services/base.service';
import { ExternalAuthDto } from '../interfaces/models/externalAuthDto';
import { AuthResponseDto } from '../interfaces/models/response/authResponseDto';
import { BaseResponse } from '../interfaces/models/base-response';
import { ResetPasswordRequest } from '../interfaces/models/reset-password-request';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  private authChangeSub = new Subject<boolean>();
  private extAuthChangeSub = new Subject<SocialUser>();
  public authChanged = this.authChangeSub.asObservable();
  public extAuthChanged = this.extAuthChangeSub.asObservable();

  public showAdditionalInfoForm = new BehaviorSubject<boolean>(false);
  public socialUserSubject = new BehaviorSubject<SocialUser | null>(null);

  public isExternalAuth?: boolean;
  private loggedIn = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient,
    private externalAuthService: SocialAuthService,
    private envUrl: BaseService,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );

    this.user = this.userSubject.asObservable();

    this.externalAuthService.authState.subscribe((user) => {
      this.extAuthChangeSub.next(user);
      this.isExternalAuth = true;
      this.handleSocialUserLogin(user);
    });

     this.loggedIn.next(!!this.userSubject.value);
    this.checkAdditionalInfoFormState();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private checkAdditionalInfoFormState(): void {
    const storedUser = JSON.parse(localStorage.getItem('user')!);
    if (storedUser && this.loggedIn.value) {
      if (storedUser.firstName && storedUser.lastName && storedUser.phoneNumber) {
        this.showAdditionalInfoForm.next(false);
      } else {
        this.showAdditionalInfoForm.next(true);
      }
    } else {
      this.showAdditionalInfoForm.next(false);
    }
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  public updateUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<any>(`${this.envUrl.baseUrl}/api/${Auth.AUTH}/${Auth.LOGIN}`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // Store user details and JWT token in local storage to keep user logged in
          if (user.isSucceed) {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            this.loggedIn.next(false);
          }
          return user;
        })
      );
  }

  logOut(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    this.signOutExternal();
    this.sendAuthStateChangeNotification(false);
    this.resetAdditionalInfoFormState();
    this.loggedIn.next(true);
  }

  //start login with google

  resetAdditionalInfoFormState(): void {
    this.showAdditionalInfoForm.next(false);
  }

  public handleSocialUserLogin(user: SocialUser): void {
    if (user && user.idToken) {
      this.checkUserRegistrationStatus(user.idToken).subscribe(
        (isRegistered) => {
          if (isRegistered) {
            this.updateUser(user as any);
            localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['/']);
          } else {
            this.socialUserSubject.next(user);
            this.showAdditionalInfoForm.next(true);
          }
        },
        (error) => {
          console.error('Error checking user registration status:', error);
          // Handle error if needed
        }
      );
    }
  }

  public signInWithGoogle = () => {
    this.externalAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => this.router.navigate(['/']));
  };

  public signOutExternal = () => {
    this.externalAuthService.signOut();
  };

  public externalLogin = (route: string, body: ExternalAuthDto) => {
    return this.http.post<AuthResponseDto>(
      this.createCompleteRoute(route, this.envUrl.baseUrl),
      body
    );
  };

  checkUserRegistrationStatus(idToken: string): Observable<boolean> {
    const url = `${this.envUrl.baseUrl}/api/${Auth.AUTH}/${Auth.CHECK_USER_REGISTRATION_STATUS}?idToken=${idToken}`;
    return this.http.get<boolean>(url);
  }

  registerAdditionalInfo(
    socialUser: SocialUser,
    additionalInfo: any
  ): Observable<any> {
    const registerInfo = {
      ...additionalInfo,
      UserName: socialUser.email,
      provider: socialUser.provider,
      idToken: socialUser.idToken,
    };
    return this.http.post<any>(
      `${this.envUrl.baseUrl}/api/${Auth.AUTH}/${Auth.REGISTER_ADDITIONAL_INFO}`,
      registerInfo
    );
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };

  //end login with google

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
