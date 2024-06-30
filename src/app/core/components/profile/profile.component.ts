import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../services/authentication.service';

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
      address: [{ value: '', disabled: true }, Validators.required],
      dob: [{ value: '', disabled: true }, Validators.required],
    });
    this.getProfile();
  }

  getProfile(): void {
    this.loading = true;
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getProfile(userId).subscribe({
        next: (response: any) => {
          if (response.isSucceed) {
            this.profileForm.patchValue(response.result);
          }
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error fetching profile', err);
          this.loading = false;
        },
      });
    } else {
      console.error('User ID not found');
      this.loading = false;
    }
  }

  enableEditing(): void {
    this.editable = true;
    this.profileForm.enable();
  }

  disableEditing(): void {
    this.editable = false;
    this.profileForm.disable();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  updateProfile(): void {
    if (!this.editable) {
      return;
    }

    this.loading = true;
    const formData = new FormData();
    Object.keys(this.profileForm.controls).forEach((key) => {
      formData.append(key, this.profileForm.get(key)?.value);
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
