import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { MessageModule } from "primeng/message"; 


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
        MessageModule
    ],
    declarations: [
        AppComponent,
        LoginComponent
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
        MessageModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }