import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ServiceService } from '../../../../services/service.service';
import { HotelService } from '../../../../services/hotel.service';
import { ManageServicesComponent } from './manage-services.component';
import { ManageServicesRoutingModule } from './manage-services-routing.module';

@NgModule({
  declarations: [ManageServicesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    PaginatorModule,
    ToastModule,
    ManageServicesRoutingModule,
  ],
  providers: [ServiceService, HotelService, MessageService],
})
export class ManageServicesModule {}
