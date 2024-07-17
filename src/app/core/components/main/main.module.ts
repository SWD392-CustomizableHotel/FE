import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
    imports: [
        CommonModule,
        MainRoutingModule,
        FileUploadModule
    ],
    declarations: [
    ],
})

export class MainModule {}