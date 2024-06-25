import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/authentication.service';
import { Message, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ExternalAuthDto } from '../../../interfaces/models/externalAuthDto';
import { BehaviorSubject } from 'rxjs';
import { GoogleCommonService } from '../../../services/google-common.service';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  additionalInfoForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  messages!: Message[];
  email!: string;
  userNameIsRequired!: Message[];
  passwordIsRequired!: Message[];
  firstNameIsRequired!: Message[];
  lastNameIsRequired!: Message[];
  phoneNumberIsRequired!: Message[];

  showError?: boolean;
  errorMessage: string = '';
  showAdditionalInfoForm = false;
  socialUser!: SocialUser;
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  visible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private googleCommonService: GoogleCommonService,
    private socialAuthService: SocialAuthService,
    private messageService: MessageService
  ) {
    if (this.authenticationService.userValue) {
      this.isLoggedIn.next(true);
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.additionalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      this.isLoggedIn.next(true);
    }

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      if (user && user.idToken) {
        this.checkUserRegistrationStatus(user.idToken);
      } else {
        const storedSocialUser = localStorage.getItem('socialUser');
        if (storedSocialUser) {
          this.socialUser = JSON.parse(storedSocialUser);
          this.showAdditionalInfoForm = true;
        }
      }
    });

    this.googleCommonService.showAdditionalInfoForm.subscribe((show) => {
      this.showAdditionalInfoForm = show;
    });

    this.googleCommonService._isLoggedIn.subscribe((loggedIn) => {
      if (!loggedIn) {
        this.showAdditionalInfoForm = false;
      }
    });

    this.messages = [
      { severity: 'error', summary: 'Error', detail: 'Unknown error' },
    ];
    this.userNameIsRequired = [
      { severity: 'error', summary: 'Invalid', detail: 'Username is required' },
    ];
    this.passwordIsRequired = [
      { severity: 'error', summary: 'Invalid', detail: 'Password is required' },
    ];
    this.firstNameIsRequired = [
      {
        severity: 'error',
        summary: 'Invalid',
        detail: 'Firstname is required',
      },
    ];
    this.lastNameIsRequired = [
      { severity: 'error', summary: 'Invalid', detail: 'Password is required' },
    ];
    this.phoneNumberIsRequired = [
      {
        severity: 'error',
        summary: 'Invalid',
        detail: 'Phonenumnber is required',
      },
    ];
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  get f(): any {
    return this.loginForm.controls;
  }

  get f2(): any {
    return this.additionalInfoForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.error = '';
    this.loading = true;
    this.authenticationService
      .login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.isLoggedIn.next(true);
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }

  logout(): void {
    this.authenticationService.logOut();
    this.socialAuthService.signOut();
    this.showAdditionalInfoForm = false;
    this.isLoggedIn.next(true);
    localStorage.removeItem('showAdditionalInfoForm');
  }

  onAdditionalInfoSubmit(): void {
    this.submitted = true;

    if (this.additionalInfoForm.invalid) {
      return;
    }

    this.error = '';
    this.loading = true;
    const additionalInfo = this.additionalInfoForm.value;

    this.googleCommonService
      .registerAdditionalInfo(this.socialUser, additionalInfo)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          const user = this.googleCommonService.userSocialValue;
          if (user) {
            user.firstName = additionalInfo.firstName;
            user.lastName = additionalInfo.lastName;
            localStorage.setItem('socialUser', JSON.stringify(user));
          }
          this.googleCommonService.sendAuthStateChangeNotification(true);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            console.error('Bad Request:', err.error);
          } else {
            this.error = err.message || 'Unknown error occurred.';
          }
          this.loading = false;
        },
      });
  }

  externalLogin(): void {
    this.showError = false;
    this.googleCommonService.signInWithGoogle();

    this.googleCommonService.extAuthChanged.subscribe((user) => {
      const externalAuth: ExternalAuthDto = {
        provider: user.provider,
        idToken: user.idToken,
      };
      this.validateExternalAuth(externalAuth);
    });
  }

  private validateExternalAuth(externalAuth: ExternalAuthDto): void {
    this.googleCommonService
      .externalLogin('/api/Auth/ExternalLogin', externalAuth)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.googleCommonService.sendAuthStateChangeNotification(
            res.isAuthSuccessful
          );
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.showError = true;
          this.googleCommonService.signOutExternal();
        },
      });
  }

  private checkUserRegistrationStatus(idToken: string): void {
    this.googleCommonService.checkUserRegistrationStatus(idToken).subscribe({
      next: (isRegistered) => {
        if (isRegistered) {
          this.router.navigate(['/']);
        } else {
          this.showAdditionalInfoForm = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.message || 'Unknown error';
      },
    });
  }

  showDialog(): void {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
  }

  returnHome(): void {
    this.router.navigate(['/']);
  }

  resetMyPassword(): void {
    this.loading = true;
    if (!this.email) {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'You must enter the email.',
        life: 3000,
      });
      return;
    }
    this.authenticationService
      .forgotPassword(this.email)
      .subscribe((response) => {
        this.loading = false;
        if (!response.isSucceed) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${response.message}`,
            life: 3000,
          });
        } else {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${response.message}`,
            life: 6000,
          });
        }
      });
  }
}
