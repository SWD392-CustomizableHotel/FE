import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizingRoomComponent } from './customizing-room.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { StyleClassModule } from 'primeng/styleclass';
import { TagModule } from 'primeng/tag';
import { sharedModule } from '../layout/share/shared.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [CustomizingRoomComponent],
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
    ToolbarModule,
    ToastModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [CustomizingRoomComponent],
})
export class CustomizingRoomModule {}
