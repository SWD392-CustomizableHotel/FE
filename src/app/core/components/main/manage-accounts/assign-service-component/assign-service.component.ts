import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Service } from '../../../../../interfaces/models/service';
import { HotelServicesService } from '../../../../../services/hotel-service.service';

@Component({
  providers: [DialogService, MessageService],
  templateUrl: './assign-service.component.html',
})
export class AssignServiceComponent implements OnInit {
  loading: boolean = false;
  services: Service[] = [];
  service: Service = {};
  selectedService?: Service;
  rows: number = 10;
  cols: any[] = [];
  first: number = 0;

  constructor(
    private hotelServicesService: HotelServicesService,
    private dialogService: DialogService,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.hotelServicesService
      .getAllService(this.first / this.rows, this.rows)
      .subscribe({
        next: (data) => {
          this.services = data.data;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  selectProduct(value: Service): void {
    this.ref.close(value);
  }

  getSeverity(status: string): any {
    switch (status) {
        case 'Open':
            return 'success';
        case 'Closed':
            return 'danger';
        case 'On-demand':
            return 'warning';
        case 'Daily-service':
            return 'info';
        default:
            return 'secondary';
    }
}
}
