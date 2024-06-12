import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of } from 'rxjs';
import { User } from '../interfaces/models/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../assets/environments/environment.prod';
import { Auth } from '../../assets/constants/constants';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BaseService } from '../services/base.service';
import { ExternalAuthDto } from '../interfaces/models/externalAuthDto';
import { AuthResponseDto } from '../interfaces/models/response/authResponseDto';

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

  public isExternalAuth?: boolean;
  
  constructor(
    private http: HttpClient,
    private externalAuthService: SocialAuthService,
    private envUrl: BaseService,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.externalAuthService.authState.subscribe((user) => {
      console.log(user);
      this.extAuthChangeSub.next(user);
      this.isExternalAuth = true;
    });
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();

    this.externalAuthService.authState.subscribe((user) => {
      if (user) {
        this.extAuthChangeSub.next(user);
        // this.authenticateUserWithGoogle(user.idToken).subscribe();
      }
    });
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http
      .post<any>(
        `${environment.BACKEND_API_URL}/api/${Auth.AUTH}/${Auth.LOGIN}`,
        { username, password }
      )
      .pipe(
        map((user) => {
          // Store user details and JWT token in local storage to keep user logged in
          if (user.isSucceed) {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
          }
        })
      );
  }

  logOut(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    this.sendAuthStateChangeNotification(false);
  }

  public signInWithGoogle = () => {
    this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
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

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };
}
