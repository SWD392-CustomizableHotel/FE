/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { ExternalAuthDto } from '../interfaces/models/externalAuthDto';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  map,
  tap,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/models/user';
import { environment } from '../../assets/environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleCommonService {
  private userSocialSubject!: BehaviorSubject<User | null>;
  public userSocial!: Observable<User | null>;
  public showAdditionalInfoForm = new BehaviorSubject<boolean>(false);

  private authChangeSub = new Subject<boolean>();
  private extAuthChangeSub = new Subject<SocialUser>();
  public authChanged = this.authChangeSub.asObservable();
  public extAuthChanged = this.extAuthChangeSub.asObservable();

  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState = this.authStateSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn = this.isLoggedInSubject.asObservable();

  constructor(
    private externalAuthService: SocialAuthService,
    private authService: AuthenticationService,
    private http: HttpClient,
    private router: Router
  ) {
    this.userSocialSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('socialUser')!)
    );
    this.userSocial = this.userSocialSubject.asObservable();
  }

  signInWithGoogle(): void {
    this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOutExternal(): void {
    this.externalAuthService.signOut();
    this.setLoggedIn(false);
    // this.setShowAdditionalInfoForm(false);
    this.clearLocalStorage();
    this.router.navigate(['/login']);
  }

  public clearLocalStorage(): void {
    localStorage.removeItem('socialUser');
    localStorage.removeItem('user');
    localStorage.removeItem('showAdditionalInfoForm');
  }

  public get userSocialValue(): User | null {
    return this.userSocialSubject.value;
  }

  setShowAdditionalInfoForm(show: boolean): void {
    this.showAdditionalInfoForm.next(show);
  }

  externalLogin(route: string, externalAuth: ExternalAuthDto): Observable<any> {
    return this.http
      .post<any>(`${environment.BACKEND_API_URL}/${route}`, externalAuth)
      .pipe(
        map((res) => {
          if (res.token) {
            this.authService.setUserValue(res);
            this.saveSocialUser(res);
            this.setLoggedIn(true);
            this.sendAuthStateChangeNotification(true, res.role);
          }
          return res;
        }),
        catchError((error) => {
          console.error('External login error:', error);
          throw error;
        })
      );
  }

  saveSocialUser(res: any): void {
    const socialUser: User = {
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      phoneNumber: res.phoneNumber,
      token: res.token,
      role: res.role,
    };
    localStorage.setItem('socialUser', JSON.stringify(socialUser));
    localStorage.setItem('user', JSON.stringify(res));
    this.userSocialSubject.next(socialUser);
  }

  registerAdditionalInfo(
    socialUser: User,
    additionalInfo: any
  ): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Auth/RegisterAdditionalInfo`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${socialUser.token}`,
    });
    const body = {
      ...additionalInfo,
      UserName: socialUser.email,
    };

    return this.http.post<any>(url, body, { headers }).pipe(
      tap((res) => {
        this.authService.setUserValue(res);
        this.setLoggedIn(true);
        this.sendAuthStateChangeNotification(true, res.role);
      })
    );
  }

  //navigate when login with role Admin or Staff
  sendAuthStateChangeNotification(
    isAuthenticated: boolean,
    role: string
  ): void {
    this.authStateSubject.next(isAuthenticated);
    this.isLoggedInSubject.next(isAuthenticated);
    this.setShowAdditionalInfoForm(false);
  }

  checkUserRegistrationStatus(idToken: string): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Auth/CheckUserRegistrationStatus?idToken=${idToken}`;
    return this.http.get<any>(url).pipe(
      map((res: any) => {
        if (res && res.isSucceed) {
          this.authService.setUserValue(res);
          this.saveSocialUser(res);
          this.setLoggedIn(true);
          this.setShowAdditionalInfoForm(false);
          this.sendAuthStateChangeNotification(true, res.role);
        } else {
          this.setShowAdditionalInfoForm(true);
        }
        return res;
      }),
      catchError((error) => {
        console.error('Check registration status error:', error);
        throw error;
      })
    );
  }

  setLoggedIn(loggedIn: boolean): void {
    this.isLoggedInSubject.next(loggedIn);
  }
}
