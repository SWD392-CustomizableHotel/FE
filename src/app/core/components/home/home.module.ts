import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { StyleClassModule } from 'primeng/styleclass';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { sharedModule } from '../layout/share/shared.module';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ButtonModule,
        RippleModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        DropdownModule,
        CalendarModule,
        FloatLabelModule,
        InputNumberModule,
        sharedModule,
        RatingModule,
        FormsModule,
        SliderModule,
        ToastModule
    ],
    providers: [MessageService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [HomeComponent],
})

export class HomeModule {}