import { NgModule } from '@angular/core';
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
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ResetPasswordComponent } from './core/components/reset-password/reset-password.component';
import { PasswordModule } from 'primeng/password';
import { RegisterComponent } from './core/components/register/register.component';
import { MessageService } from 'primeng/api';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';

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
    DialogModule,
    ProgressBarModule,
    ToastModule,
    PasswordModule,
    ButtonModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    NotfoundComponent,
    ResetPasswordComponent,
    RegisterComponent,
    VerifyEmailComponent,
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
    DialogModule,
    ProgressBarModule,
    ToastModule,
    PasswordModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ProductService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
