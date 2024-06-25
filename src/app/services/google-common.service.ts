import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ExternalAuthDto } from '../interfaces/models/externalAuthDto';
import { BehaviorSubject, Observable, Subject, catchError, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/models/user';
import { environment } from '../../assets/environments/environment';

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

  private isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private externalAuthService: SocialAuthService,
    private http: HttpClient
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
  }

  public get userSocialValue(): User | null {
    return this.userSocialSubject.value;
  }

  get _isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  externalLogin(route: string, externalAuth: ExternalAuthDto): Observable<any> {
    return this.http.post<any>(`${environment.BACKEND_API_URL}/${route}`, externalAuth).pipe(
      map((res) => {
        if (res.token) {
          this.saveSocialUser(res);
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
      token: res.token,
    };
    localStorage.setItem('socialUser', JSON.stringify(socialUser));
    localStorage.setItem('token', res.token);
    this.userSocialSubject.next(socialUser);
  }

  registerAdditionalInfo(socialUser: User, additionalInfo: any): Observable<any> {
    const url = `${environment.BACKEND_API_URL}/api/Auth/RegisterAdditionalInfo`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${socialUser.token}`,
    });
    const body = JSON.stringify(additionalInfo);

    return this.http.post<any>(url, body, { headers });
  }

  sendAuthStateChangeNotification(isAuthenticated: boolean): void {
    this.authStateSubject.next(isAuthenticated);
  }

  checkUserRegistrationStatus(idToken: string): Observable<boolean> {
    const url = `${environment.BACKEND_API_URL}/api/Auth/CheckUserRegistrationStatus?idToken=` + idToken;
    return this.http.get<boolean>(url);
  }
}
