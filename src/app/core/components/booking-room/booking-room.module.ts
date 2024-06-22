import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BookingRoomComponent } from './booking-room.component';
import { CommonModule } from '@angular/common';
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
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ScrollPanelModule } from 'primeng/scrollpanel';
@NgModule({
    declarations: [
        BookingRoomComponent,
    ],
    imports: [
        CommonModule,
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
        InputIconModule,
        IconFieldModule,
        InputTextModule,
        DataViewModule,
        TagModule,
        ScrollPanelModule,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [BookingRoomComponent],
})

export class BookingRoomModule {}