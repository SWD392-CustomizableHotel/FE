import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../../../services/service.service';
import { MessageService } from 'primeng/api';
import { Service } from '../../../../interfaces/models/service';
import { Table } from 'primeng/table';
import { Hotel } from '../../../../interfaces/models/hotels';
import { HotelService } from '../../../../services/hotel.service';

interface ExpandedRows {
  [key: string]: boolean;
}

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.scss'],
  providers: [MessageService],
})
export class ManageServicesComponent implements OnInit {
  isEdit: boolean = false;
  serviceDialog: boolean = false;
  createServiceDialog: boolean = false;
  deleteServiceDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = true;
  services: Service[] = [];
  service: Service = {};
  hotels: Hotel[] = [];
  expandedRows: ExpandedRows = {};
  cols: any[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  rowsPerPageOptions = [5, 10, 20];
  searchTerm?: string;
  serviceStatus?: string;
  serviceStatusOptions = [
    { status: 'Open' },
    { status: 'Closed' },
    { status: 'OnDemand' },
    { status: 'DailyService' },
  ];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];
  selectedServiceStatus: { status: string } | undefined;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private serviceService: ServiceService,
    private messageService: MessageService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.loadServices(1, this.rows, this.serviceStatus, this.searchTerm);
    this.cols = [
      { field: 'id', header: 'Service ID' },
      { field: 'name', header: 'Name' },
      { field: 'price', header: 'Price' },
      { field: 'status', header: 'Status' },
      { field: 'hotelId', header: 'Hotel' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
    ];
    this.loadHotels(); // Load hotels data
  }

  private loadServices(
    pageNumber: number,
    pageSize: number,
    serviceStatus?: string,
    searchTerm?: string
  ): void {
    this.loading = true;
    this.serviceService
      .getAllServices(pageNumber, pageSize, serviceStatus, searchTerm)
      .subscribe({
        next: (data) => {
          this.services = data.data.map((service: Service) => {
            return {
              ...service,
              serviceStatus: this.serviceStatusOptions.find(
                (option) => option.status === service.status
              ),
            };
          });
          this.loading = false;
          this.totalRecords = data.totalRecords;
          this.totalPages = data.totalPages;
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
      });
  }

  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels = data;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  openNew(): void {
    this.service = { status: 'Closed' };
    this.selectedServiceStatus = { status: 'Closed' };
    this.submitted = false;
    this.createServiceDialog = true;
  }

  editService(service: Service): void {
    this.service = { ...service };
    this.isEdit = true;
    this.serviceDialog = true;
  }

  hideDialog(): void {
    this.serviceDialog = false;
    this.createServiceDialog = false;
    this.submitted = false;
  }

  deleteService(service: Service): void {
    this.deleteServiceDialog = true;
    this.service = { ...service };
  }

  confirmDelete(): void {
    this.deleteServiceDialog = false;
    if (this.service.id !== undefined) {
      this.serviceService.deleteService(this.service.id).subscribe(
        () => {
          this.services = this.services.filter(
            (val) => val.id !== this.service.id
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Service Deleted',
            life: 3000,
          });
          this.loadServices(
            this.first / this.rows + 1,
            this.rows,
            this.serviceStatus,
            this.searchTerm
          );
        },
        (error) => {
          console.error('Error deleting service:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error occurred while deleting the service.',
            life: 3000,
          });
        }
      );
    } else {
      console.error('Service ID is undefined');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Service ID is undefined.',
        life: 3000,
      });
    }
  }

  saveService(): void {
    this.submitted = true;
    const emptyFields = this.getEmptyFields();
    if (emptyFields.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `The following fields must be filled out to create a service: ${emptyFields.join(
          ', '
        )}`,
        life: 3000,
      });
    } else if (this.service.price === undefined || this.service.price < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Price cannot be negative or undefined.',
        life: 3000,
      });
    } else if (this.service.hotelId === undefined || this.service.hotelId < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hotel ID cannot be negative or undefined.',
        life: 3000,
      });
    } else {
      if (this.isEdit) {
        this.serviceService
          .updateService(
            this.service.id!,
            this.service.name || '',
            this.service.description || '',
            this.service.price || 0,
            this.service.startDate?.toISOString() || '',
            this.service.endDate?.toISOString() || ''
          )
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Service Updated',
              life: 3000,
            });
            this.loadServices(
              this.first / this.rows + 1,
              this.rows,
              this.serviceStatus,
              this.searchTerm
            );
          });
      } else {
        this.service.status = this.selectedServiceStatus?.status || 'Closed';
        if (
          this.service.name &&
          this.service.price !== undefined &&
          this.service.description &&
          this.service.status &&
          this.service.hotelId
        ) {
          this.serviceService
            .createService(
              this.service.name,
              this.service.description,
              this.service.price,
              this.service.status,
              this.service.startDate?.toISOString() || '',
              this.service.endDate?.toISOString() || '',
              this.service.hotelId
            )
            .subscribe(
              () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Service Created',
                  life: 3000,
                });
                this.loadServices(
                  this.first / this.rows + 1,
                  this.rows,
                  this.serviceStatus,
                  this.searchTerm
                );
              },
              (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.error.message,
                  life: 3000,
                });
              }
            );
        }
      }
      this.isEdit = false;
      this.createServiceDialog = false;
      this.serviceDialog = false;
      this.service = {};
    }
  }

  updateServiceStatus(service: Service, newStatus: any): void {
    const statusString = newStatus.status;
    if (service.id !== undefined) {
      this.serviceService
        .updateServiceStatus(service.id, statusString)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Service Status Updated',
            life: 3000,
          });
        });
    } else {
      console.error('Service ID is undefined');
    }
  }

  onGlobalFilter(dt1: any, event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadServices(1, this.rows, this.serviceStatus, this.searchTerm);
  }

  clear(table: Table): void {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = undefined;
    this.loadServices(1, this.rows, this.serviceStatus, this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const pageNumber = this.first / this.rows + 1;
    this.loadServices(
      pageNumber,
      this.rows,
      this.serviceStatus,
      this.searchTerm
    );
  }

  onRowsChange(newRows: number): void {
    this.first = 0;
    this.rows = newRows;
    this.loadServices(1, this.rows, this.serviceStatus, this.searchTerm);
  }

  private getEmptyFields(): string[] {
    const emptyFields: string[] = [];
    if (!this.service.name) emptyFields.push('Name');
    if (this.service.price === undefined) emptyFields.push('Price');
    if (!this.service.description) emptyFields.push('Description');
    if (!this.service.hotelId) emptyFields.push('Hotel');
    return emptyFields;
  }
}
