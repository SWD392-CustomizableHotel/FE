import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../interfaces/models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  editable = false;
  selectedFile: File | null = null;
  user?: User | null;
  certificateUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.userValue;
    this.certificateUrl = this.user?.certificatePath || null;
    this.initializeForm();
    this.loadProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: [
        { value: this.user?.firstName || '', disabled: true },
        Validators.required,
      ],
      lastName: [
        { value: this.user?.lastName || '', disabled: true },
        Validators.required,
      ],
      phoneNumber: [
        { value: this.user?.phoneNumber || '', disabled: true },
        Validators.required,
      ],
      address: [
        { value: this.user?.address || '', disabled: true },
        Validators.required,
      ],
      dob: [
        {
          value: this.user?.dob ? new Date(this.user.dob) : '',
          disabled: true,
        },
        Validators.required,
      ],
      email: [
        { value: this.user?.email || '', disabled: true },
        [Validators.required, Validators.email],
      ],
    });
  }

  loadProfile(): void {
    if (this.user?.email) {
      this.userService.getProfile(this.user.email).subscribe({
        next: (response: any) => {
          if (response.isSucceed) {
            this.profileForm.patchValue({
              ...response.result,
              dob: response.result.dob ? new Date(response.result.dob) : '',
            });
            this.certificateUrl = response.result.certificatePath || null;
          }
        },
        error: (err: any) => {
          console.error('Error fetching profile', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error fetching profile: ' +
              (err.error?.message || 'Unknown error'),
          });
        },
      });
    } else {
      console.error('User email not found');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User email not found',
      });
    }
  }

  enableEditing(): void {
    this.editable = true;
    this.profileForm.enable();
    this.profileForm.controls['email'].disable();
  }

  disableEditing(): void {
    this.editable = false;
    this.profileForm.disable();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.files[0];
  }

  onUpload(event: any): void {
    if (this.selectedFile) {
      this.messageService.add({
        severity: 'info',
        summary: 'File Uploaded',
        detail: this.selectedFile.name,
      });
    }
  }

  updateProfile(): void {
    if (!this.editable) {
      return;
    }

    if (this.profileForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields.',
      });
      return;
    }

    this.loading = true;
    const formData = new FormData();
    Object.keys(this.profileForm.controls).forEach((key) => {
      let value = this.profileForm.get(key)?.value;
      if (key === 'dob' && value) {
        value = value.toISOString(); // Convert dob to ISO string
      }
      formData.append(key, value);
    });

    if (this.selectedFile) {
      formData.append('certificate', this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateProfile(formData).subscribe({
      next: (response: any) => {
        if (response.isSucceed) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully',
          });
          this.disableEditing();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to update profile',
          });
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'An error occurred',
        });
        this.loading = false;
      },
    });
  }
}
