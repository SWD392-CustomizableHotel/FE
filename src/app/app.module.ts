import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helper/fake-backend';

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
import { PanelModule } from 'primeng/panel';
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
import { RouterLink, RouterModule } from '@angular/router';
import { ProductService } from './services/product.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';

/*google social*/
import {
  GoogleLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { environment } from '../assets/environments/environment';
/*end google login*/

import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './services/authentication.service';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ResetPasswordComponent } from './core/components/reset-password/reset-password.component';
import { PasswordModule } from 'primeng/password';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    PanelModule,
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
    RouterLink,
    BrowserModule,
    HttpClientModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:7082'],
        disallowedRoutes: [],
      },
    }),
    ToastModule,
    PasswordModule,
    DialogModule,
    ProgressBarModule,
    StyleClassModule,
    GoogleSigninButtonModule 
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    NotfoundComponent,
    ResetPasswordComponent,
  ],
  exports: [
    PanelModule,
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
    RouterLink,
    SocialLoginModule,
    GoogleSigninButtonModule,
    DialogModule,
    ProgressBarModule,
    ToastModule,
    PasswordModule,
    StyleClassModule,
    GoogleSigninButtonModule 
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ProductService,
    AuthenticationService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
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
    // provider used to create fake backend
    fakeBackendProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
