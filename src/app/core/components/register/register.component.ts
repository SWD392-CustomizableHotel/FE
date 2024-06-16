import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  visible = false;
  email = '';
  showDialog = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f(): { [key: string]: any } {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('Form Submitted:', this.registerForm.value);

    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      if (this.f['userName'].errors) {
        if (this.f['userName'].errors['required']) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Username is required',
          });
        }
      }
      if (this.f['email'].errors) {
        if (this.f['email'].errors['required']) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email is required',
          });
        } else if (this.f['email'].errors['email']) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid email',
          });
        }
      }
      if (this.f['password'].errors) {
        if (this.f['password'].errors['required']) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Password is required',
          });
        } else if (this.f['password'].errors['minlength']) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Password must be at least 6 characters',
          });
        }
      }
      return;
    }

    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      this.error = 'Passwords do not match';
      console.log('Passwords do not match');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match',
      });
      return;
    }

    const payload = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      userName: this.f['userName'].value,
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value,
      email: this.f['email'].value,
    };

    console.log('Request Payload:', JSON.stringify(payload, null, 2));

    this.loading = true;
    this.authenticationService.register(payload).subscribe({
      next: (response) => {
        console.log('Registration successful');
        if (response.isSucceed) {
          this.showDialog = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:
              'Registration successful, please check your email to verify your account.',
          });
        } else {
          this.error = response.message;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.log('Registration failed:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Registration failed: ' + error,
        });
        this.loading = false;
      },
    });
  }

  onOkClick(): void {
    this.showDialog = false;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  resetMyPassword(): void {
    console.log('Resetting password...');
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Password reset requested',
    });
  }
}
