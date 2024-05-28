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
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MenuComponent } from './menu/menu.component';
import { AppMenuitemComponent } from './menu/menuitem.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { ConfigModule } from './config/config.module';

@NgModule({
    declarations: [
        HeaderComponent,
        LayoutComponent,
        FooterComponent,
        SidebarComponent,
        MenuComponent,
        AppMenuitemComponent
    ],
    imports: [
        ToolbarModule,
        InputSwitchModule,
        InputTextModule,
        ButtonModule,
        SidebarModule,
        CommonModule,
        AvatarGroupModule,
        AvatarModule,
        BadgeModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        RippleModule,
        RadioButtonModule,
        ConfigModule
    ],
    bootstrap: [LayoutComponent]
})

export class LayoutModule { }