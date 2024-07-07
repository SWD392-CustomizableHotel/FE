import { NgModule } from '@angular/core';
// import { ManageAccountsComponent } from './manage-accounts.component';
// import { AccountsRoutingModule } from './accounts-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BookingHistoryComponent } from './booking-history.component';
import { sharedModule } from '../layout/share/shared.module';

@NgModule({
  imports: [
    PaginatorModule,
    CommonModule,
    FormsModule,
    TableModule,
    RatingModule,
    ButtonModule,
    SliderModule,
    InputTextModule,
    ToggleButtonModule,
    RippleModule,
    MultiSelectModule,
    DropdownModule,
    ProgressBarModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    PaginatorModule,
    TagModule,
    DynamicDialogModule,
    sharedModule,
  ],
  declarations: [BookingHistoryComponent],
  providers: [],
  bootstrap: [BookingHistoryComponent]
})
export class BookingHistoryModule {}
