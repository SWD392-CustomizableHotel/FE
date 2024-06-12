import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/authentication.service';
import { Message } from 'primeng/api';
import { User } from '../../../interfaces/models/user';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ExternalAuthDto } from '../../../interfaces/models/externalAuthDto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit {
  returnUrl?: string;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  messages!: Message[];
  userNameIsRequired!: Message[];
  passwordIsRequired!: Message[];
  user?: User | SocialUser | undefined;

  showError?: boolean;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private socialAuthService: SocialAuthService
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

    this.messages = [
      { severity: 'error', summary: 'Error', detail: 'Unknown error' },
    ];
    this.userNameIsRequired = [
      { severity: 'error', summary: 'Invalid', detail: 'Username is required' },
    ];
    this.passwordIsRequired = [
      { severity: 'error', summary: 'Invalid', detail: 'Password is required' },
    ];
  }
  get f() {
    return this.loginForm.controls;
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

  returnHome(): void {
    this.router.navigate(['/']);
  }

  logout() {
    this.socialAuthService.signOut();
    this.authenticationService.logOut();
  }

  externalLogin = () => {
    this.showError = false;
    this.authenticationService.signInWithGoogle();

    this.authenticationService.extAuthChanged.subscribe((user) => {
      const externalAuth: ExternalAuthDto = {
        provider: user.provider,
        idToken: user.idToken,
      };

      this.validateExternalAuth(externalAuth);
    });
  };

  private validateExternalAuth(externalAuth: ExternalAuthDto) {
    this.authenticationService
      .externalLogin('api/Auth/ExternalLogin', externalAuth)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.authenticationService.sendAuthStateChangeNotification(
            res.isAuthSuccessful
          );
          this.router.navigate([this.returnUrl]);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.showError = true;
          this.authenticationService.signOutExternal();
        },
      });
  }
}
