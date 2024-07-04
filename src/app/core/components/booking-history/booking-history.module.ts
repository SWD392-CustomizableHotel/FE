import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BookingHistoryComponent } from './booking-history.component';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { sharedModule } from '../layout/share/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    PaginatorModule,
    CommonModule,
    ToastModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    sharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [BookingHistoryComponent],
  providers: [],
  bootstrap: [BookingHistoryComponent]
})
export class BookingHistoryModule {}
