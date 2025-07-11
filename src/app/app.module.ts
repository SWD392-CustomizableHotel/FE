import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Third-party imports
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Assuming needed for animations

// Components and services
import { AppComponent } from './app.component';
import { JwtInterceptor } from './_helper/jwt.interceptor';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './core/components/login/login.component';
import { LayoutModule } from './core/components/layout/layout.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { RouterModule } from '@angular/router';
import { ProductService } from './services/product.service';
import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ResetPasswordComponent } from './core/components/reset-password/reset-password.component';
import { PasswordModule } from 'primeng/password';
import { RegisterComponent } from './core/components/register/register.component';
import { MessageService } from 'primeng/api';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';
import { ProfileComponent } from './core/components/profile/profile.component';
import { FileUploadModule } from 'primeng/fileupload';
// import { KebabCaseInterceptor } from './_helper/kebab-interceptor';
import { CalendarModule } from 'primeng/calendar';
import { StripeModule } from 'stripe-angular';
import { AuthenticationService } from './services/authentication.service';
import { fakeBackendProvider } from './_helper/fake-backend';
import { environment } from '../assets/environments/environment';
import { PaginatorModule } from 'primeng/paginator';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
export function tokenGetter(): any {
  return localStorage.getItem('token');
}
// import { KebabCaseInterceptor } from './_helper/kebab-interceptor';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotfoundComponent,
    ResetPasswordComponent,
    RegisterComponent,
    VerifyEmailComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    RippleModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FormsModule,
    CardModule,
    MenuModule,
    AvatarGroupModule,
    AvatarModule,
    ProgressSpinnerModule,
    CheckboxModule,
    ImageModule,
    MessagesModule,
    MessageModule,
    FloatLabelModule,
    RouterModule,
    DialogModule,
    ProgressBarModule,
    ToastModule,
    PasswordModule,
    ButtonModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    ButtonModule,
    PaginatorModule,
    FileUploadModule,
    StripeModule.forRoot(
      'pk_test_51PVP1yP7srpKRMQLK0pKqvXlaDT2Gm9spkU73T9nH43Lq5crcwI1rp0dNOn7VLA6FDKql8BxFn546RdqITdz1RSm00J8e6HLMI'
    ),
    CalendarModule,
  ],
  exports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    RippleModule,
    DividerModule,
    InputTextModule,
    FormsModule,
    CardModule,
    MenuModule,
    AvatarGroupModule,
    AvatarModule,
    ProgressSpinnerModule,
    CheckboxModule,
    ImageModule,
    MessagesModule,
    MessageModule,
    FloatLabelModule,
    RouterModule,
    DialogModule,
    ProgressBarModule,
    ToastModule,
    PasswordModule,
    SocialLoginModule,
    PaginatorModule,
    CalendarModule,
    FileUploadModule,
  ],
  providers: [
    DatePipe,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ProductService,
    MessageService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: KebabCaseInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId, {}),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    fakeBackendProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
