import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/authentication.service';
import { Message, MessageService } from 'primeng/api';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';
import { ExternalAuthDto } from '../../../interfaces/models/externalAuthDto';

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

  //properties for google
  showError?: boolean;
  errorMessage: string = '';
  showAdditionalInfoForm = false; // Toggle for showing additional info form
  socialUser!: SocialUser;
  isLoggedin!: boolean;
  visible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private socialAuthService: SocialAuthService,
    private messageService: MessageService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
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

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      if (user && user.idToken) {
        this.checkUserRegistrationStatus(user.idToken);
      }
    });

    this.authenticationService.showAdditionalInfoForm.subscribe((show) => {
      this.showAdditionalInfoForm = show;
    });

    this.authenticationService.isLoggedIn.subscribe((isLoggedIn) => {
    if (!isLoggedIn) {
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
      { severity: 'error', summary: 'Invalid', detail: 'Firstname is required' },
    ];
    this.lastNameIsRequired = [
      { severity: 'error', summary: 'Invalid', detail: 'Password is required' },
    ];
    this.phoneNumberIsRequired = [
      { severity: 'error', summary: 'Invalid', detail: 'Phonenumnber is required' },
    ];
  }

  // convenience getter for easy access to form fields
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get f() {
    return this.loginForm.controls;
  }

  get f2() {
    return this.additionalInfoForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
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
          // get return url from route parameters or default to '/'
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }

  logout() {
    this.authenticationService.logOut();
    this.showAdditionalInfoForm = false;
    localStorage.removeItem('showAdditionalInfoForm');
  }

  //Start login-google
  // Handle additional info form submission
  onAdditionalInfoSubmit(): void {
    this.submitted = true;

    if (this.additionalInfoForm.invalid) {
      return;
    }

    this.error = '';
    this.loading = true;
    const additionalInfo = this.additionalInfoForm.value;

    this.authenticationService
      .registerAdditionalInfo(this.socialUser, additionalInfo)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          const user = this.authenticationService.userValue;
          if (user) {
            user.firstName = additionalInfo.firstName;
            user.lastName = additionalInfo.lastName;
            user.phoneNumber = additionalInfo.phoneNumber;
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.authenticationService.sendAuthStateChangeNotification(true);
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
    this.authenticationService.signInWithGoogle();

    this.authenticationService.extAuthChanged.subscribe( user => {
      const externalAuth: ExternalAuthDto = {
        provider: user.provider,
        idToken: user.idToken
      }
      this.validateExternalAuth(externalAuth);
    })
  }

  private validateExternalAuth(externalAuth: ExternalAuthDto) {
    this.authenticationService.externalLogin('/api/Auth/ExternalLogin', externalAuth)
      .subscribe({
        next: (res) => {
            localStorage.setItem("token", res.token);
            this.authenticationService.sendAuthStateChangeNotification(res.isAuthSuccessful);
            this.router.navigate(['/']);
      },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.showError = true;
          this.authenticationService.signOutExternal();
        }
      });
  }

  private checkUserRegistrationStatus(idToken: string): void {
    this.authenticationService.checkUserRegistrationStatus(idToken).subscribe({
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

  //end login-google

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
    if (this.email === null || this.email === undefined) {
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
        if (!response.isSucceed) {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${response.message}`,
            life: 3000,
          });
        } else {
          this.loading = false;
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