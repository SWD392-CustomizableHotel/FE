import { NgModule } from '@angular/core';
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
import { FileUploadModule } from 'primeng/fileupload';
import { UploadIdentityCardRoutingModule } from './upload-identity-card.routing.module';
import { IdentityCardService } from '../../../../services/identity-card.service';
import { MessageService } from 'primeng/api';
import { sharedModule } from '../../layout/share/shared.module';
import { UploadIdentityCardComponent } from './upload-identity-card.component';

@NgModule({
  declarations: [UploadIdentityCardComponent],
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
    TagModule,
    DynamicDialogModule,
    FileUploadModule,
    sharedModule,
    UploadIdentityCardRoutingModule,
  ],
  providers: [MessageService, IdentityCardService],
  bootstrap: [UploadIdentityCardComponent]
})
export class UploadIdentityCardModule {}