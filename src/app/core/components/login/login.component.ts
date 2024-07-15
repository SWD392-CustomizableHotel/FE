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
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { BookingService } from '../../../services/booking.service';

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
  userId?: string;
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
    private messageService: MessageService,
    private bookingService: BookingService
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

    const isLoggedIn = localStorage.getItem('user');
    if (isLoggedIn) {
      this.isLoggedIn.next(true);
      this.router.navigate(['/']);
    }

    this.googleCommonService.setShowAdditionalInfoForm(false);

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      if (user && user.idToken) {
        this.checkUserRegistrationStatus(user.idToken);
      } else {
        const storedSocialUser = localStorage.getItem('socialUser');
        if (storedSocialUser) {
          this.socialUser = JSON.parse(storedSocialUser);
          this.googleCommonService
            .checkUserRegistrationStatus(this.socialUser.idToken)
            .subscribe((res) => {
              if (res && res.isSucceed) {
                this.showAdditionalInfoForm = false;
              } else {
                this.showAdditionalInfoForm = true;
              }
            });
        }
      }
    });

    this.googleCommonService.showAdditionalInfoForm.subscribe((show) => {
      this.showAdditionalInfoForm = show;
    });

    this.googleCommonService.isLoggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        const user = this.googleCommonService.userSocialValue;
        if (user && user.firstName && user.lastName && user.phoneNumber) {
          this.showAdditionalInfoForm = false;
        }
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
        detail: 'First Name is required',
      },
    ];
    this.lastNameIsRequired = [
      { severity: 'error', summary: 'Invalid', detail: 'Password is required' },
    ];
    this.phoneNumberIsRequired = [
      {
        severity: 'error',
        summary: 'Invalid',
        detail: 'Phone Number is required',
      },
    ];
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
        next: (user) => {
          this.userId = user.userId;
          localStorage.setItem('userId', this.userId!);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.isLoggedIn.next(true);
          // this.router.navigate([returnUrl]);
          if (user.role === 'ADMIN' || user.role === 'STAFF') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate([returnUrl]);
          }
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }

  navigateInRole(role: string): void {
    if (role === 'ADMIN' || role === 'STAFF') {
      this.router.navigate(['', 'dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authenticationService.logOut();
    this.googleCommonService.signOutExternal();
    this.googleCommonService.setShowAdditionalInfoForm(false);
    this.isLoggedIn.next(false);
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
          this.isLoggedIn.next(true);
          localStorage.setItem('user', JSON.stringify(res));
          localStorage.setItem('socialUser', JSON.stringify(res));
          const user = this.googleCommonService.userSocialValue;
          if (user) {
            user.firstName = additionalInfo.firstName;
            user.lastName = additionalInfo.lastName;
            user.phoneNumber = additionalInfo.phoneNumber;
          }
          this.googleCommonService.sendAuthStateChangeNotification(
            true,
            res.role
          );
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
        next: (res) => {
          localStorage.setItem('socialUser', res);
          this.googleCommonService.sendAuthStateChangeNotification(
            res.isAuthSuccessful,
            res.role
          );
          this.googleCommonService.setLoggedIn(true);
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
      next: (res) => {
        if (res?.isSucceed) {
          localStorage.setItem('socialUser', JSON.stringify(res));
          this.googleCommonService.setLoggedIn(true);
          const role = res.role;
          this.navigateInRole(role);
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
    this.isLoggedIn.next(false);
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
