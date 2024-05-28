import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { StyleClassModule } from 'primeng/styleclass';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ButtonModule,
        RippleModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule
    ],
    bootstrap: [HomeComponent]
})

export class HomeModule { }