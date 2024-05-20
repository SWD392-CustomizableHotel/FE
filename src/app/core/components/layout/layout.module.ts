import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ToolbarModule } from 'primeng/toolbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RippleModule } from 'primeng/ripple';

@NgModule({
    declarations: [
        HeaderComponent,
        LayoutComponent
    ],
    imports: [
        ToolbarModule,
        InputSwitchModule,
        InputTextModule,
        ButtonModule,
        CommonModule,
        AvatarGroupModule,
        AvatarModule,
        RouterModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        RippleModule
    ],
    bootstrap: [LayoutComponent]
})

export class LayoutModule { }