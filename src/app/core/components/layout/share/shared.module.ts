import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { HeaderSharedComponent } from './header-shared/header-shared.component';
import { FooterSharedComponent } from './footer-shared/footer-shared.component';
@NgModule({

    declarations: [
        FooterComponent,
        HeaderComponent,
        HeaderSharedComponent,
        FooterSharedComponent,
    ],

    imports: [
         CommonModule,
         RouterModule,
         CalendarModule,
         FloatLabelModule,
         InputNumberModule,
         ButtonModule,
         DropdownModule,
    ],

    exports: [
        FooterComponent,
        HeaderComponent,
        HeaderSharedComponent,
        FooterSharedComponent,
    ],
})

export class sharedModule { }