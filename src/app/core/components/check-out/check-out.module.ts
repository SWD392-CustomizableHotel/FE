import { NgModule } from '@angular/core';
import { CheckOutComponent } from './check-out.component';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
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
    declarations: [CheckOutComponent]
})
export class CheckOutModule {}
