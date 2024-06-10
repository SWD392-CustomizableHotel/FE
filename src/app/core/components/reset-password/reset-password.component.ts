import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { ResetPasswordRequest } from '../../../interfaces/models/reset-password-request';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: 'reset-password.component.html',
  providers: [MessageService]
})
export class ResetPasswordComponent {
  email!: string;
  token!: string;
  password: string = '';
  confirmPassword: string = '';
  loading = false;
  messages!: Message[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }

  onClickResetButton(): void {

    if (this.password === '' || this.password === undefined) {
      this.messages = [{ severity: 'error', detail: 'Please enter your password' }];
      this.loading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.messages = [{ severity: 'error', detail: 'Password does not match' }];
      this.loading = false;
      return;
    }

    const resetRequest: ResetPasswordRequest = {
      email: this.email,
      token: this.token,
      password: this.password
    };

    this.loading = true;

    this.authService.resetPassword(resetRequest).subscribe({
      next: (response) => {
        if (response.isSucceed) {
          this.messageService.add(
            { severity: 'success', summary: 'Success', detail: `${response.message}, this page will be closed automatically after 5 seconds`, life: 6000 }
          );
          setTimeout(() => {
            window.close();
          }, 5000);
        } else {
          this.loading = false;
          this.messageService.add(
            { severity: 'error', summary: 'Error', detail: `${response.message}`, life: 3000 }
          );
        }
      },
      error: (): void => {
        this.loading = false;
        this.messageService.add(
          { severity: 'error', summary: 'Error', detail: `Something went wrong! Please try again.`, life: 3000 }
        );
      }
    });
  }

  goBackHomePage(): void {
    this.router.navigate(['']);
  }
}
