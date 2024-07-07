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

import { ManageAmenitiesComponent } from './manage-amenities.component';
import { ManageAmenitiesRoutingModule } from './manage-amenities-routing.module';
import { AmenityService } from '../../../../services/amenity.service';
import { HotelService } from '../../../../services/hotel.service';

@NgModule({
  declarations: [ManageAmenitiesComponent],
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
    ManageAmenitiesRoutingModule,
  ],
  providers: [AmenityService, HotelService, MessageService],
})
export class ManageAmenitiesModule {}
