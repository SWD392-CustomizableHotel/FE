import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { ManageServicesComponent } from './manage-services.component';
import { ManageServicesRoutingModule } from './manage-services-routing.module';
import { ServiceService } from '../../../../services/service.service';
import { HotelService } from '../../../../services/hotel.service';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [ManageServicesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    PaginatorModule,
    ToastModule,
    CalendarModule,
    ManageServicesRoutingModule,
  ],
  providers: [ServiceService, HotelService, MessageService],
})
export class ManageServicesModule {}
