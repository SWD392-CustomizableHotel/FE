import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../../../services/service.service';
import { MessageService } from 'primeng/api';
import { Service } from '../../../../interfaces/models/service';
import { Table } from 'primeng/table';
import { Hotel } from '../../../../interfaces/models/hotels';
import { HotelService } from '../../../../services/hotel.service';
import { Staff } from '../../../../interfaces/models/staff';
import { UserService } from '../../../../services/user.service';

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
  assignStaffDialog: boolean = false;
  confirmStatusChangeDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = true;
  services: Service[] = [];
  service: Service = {};
  hotels: Hotel[] = [];
  staff: Staff[] = [];
  selectedStaff: Staff[] = [];
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
    { status: 'On Demand' },
    { status: 'Daily Service' },
  ];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];
  selectedServiceStatus: { status: string } | undefined;
  newStatus: string | undefined;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private serviceService: ServiceService,
    private messageService: MessageService,
    private hotelService: HotelService,
    private userService: UserService
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
    this.loadStaff(); // Load staff data
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
        this.hotels = data.data;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  private loadStaff(): void {
    this.userService.getStaff().subscribe({
      next: (data) => {
        this.staff = data;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  openNew(): void {
    this.service = {
      status: 'Closed',
    };
    this.selectedServiceStatus = { status: 'Closed' };
    this.submitted = false;
    this.createServiceDialog = true;
  }

  editService(service: Service): void {
    this.service = { ...service };

    // Convert startDate and endDate to Date objects if they are not undefined
    if (service.startDate) {
      this.service.startDate = new Date(service.startDate);
    } else {
      this.service.startDate = new Date(); // Default value if startDate is not available
    }

    if (service.endDate) {
      this.service.endDate = new Date(service.endDate);
    } else {
      this.service.endDate = new Date(); // Default value if endDate is not available
    }

    this.selectedServiceStatus = this.serviceStatusOptions.find(
      (option) => option.status === service.status
    );

    this.selectedStaff = service.assignedStaff || [];
    this.selectedStaff =
      service.assignedStaff?.map((staff) => ({
        id: staff.id,
        userName: staff.userName,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
      })) || [];
    this.isEdit = true;
    this.serviceDialog = true;
  }

  hideDialog(): void {
    this.serviceDialog = false;
    this.createServiceDialog = false;
    this.submitted = false;
  }

  deleteService(service: Service): void {
    if (service.status !== 'Closed') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Only services with status "Closed" can be deleted.',
        life: 3000,
      });
      return;
    }

    if (service.assignedStaff && service.assignedStaff.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Service cannot be deleted while staff are assigned to it.',
        life: 3000,
      });
      return;
    }

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
    } else if (
      this.service.startDate &&
      this.service.endDate &&
      this.service.startDate >= this.service.endDate
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'End Date must be greater than Start Date.',
        life: 3000,
      });
    } else if (this.service.startDate && this.service.startDate <= new Date()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Start Date must be in the future.',
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
          .subscribe({
            next: (updatedService) => {
              if (this.selectedStaff.length > 0) {
                this.assignStaffToService(
                  updatedService.data.id!,
                  this.selectedStaff.map((s) => s.id)
                );
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else {
                this.removeAssignedStaff(updatedService.data.id!);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Remove assignStaff successfully!',
                  life: 3000,
                });
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Service Updated',
                life: 3000,
              });
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            },
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
            .subscribe({
              next: (createdService) => {
                if (this.selectedStaff.length > 0) {
                  this.assignStaffToService(
                    createdService.data.id!,
                    this.selectedStaff.map((s) => s.id)
                  );
                }
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
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.error.message,
                  life: 3000,
                });
              },
            });
        }
      }

      this.isEdit = false;
      this.createServiceDialog = false;
      this.serviceDialog = false;
      this.service = {};
    }
  }

  assignStaffToService(serviceId: number, staffIds: string[]): void {
    console.log('Assigning Staff to Service ID:', serviceId); // Log the service ID
    console.log('Staff IDs:', staffIds); // Log the staff IDs
    this.serviceService.assignStaffToService(serviceId, staffIds).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Staff Assigned',
          life: 3000,
        });
      },
    });
  }

  removeAssignedStaff(serviceId: number): void {
    this.serviceService.removeStaffAssignments(serviceId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Staff Assignments Removed',
          life: 3000,
        });
      },
    });
  }

  updateServiceStatus(service: Service, newStatus: any): void {
    this.newStatus = newStatus.status;
    this.confirmStatusChangeDialog = true;
  }

  confirmStatusChange(): void {
    if (this.service.id !== undefined && this.newStatus !== undefined) {
      this.serviceService
        .updateServiceStatus(this.service.id, this.newStatus)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Service Status Updated',
            life: 3000,
          });
          this.confirmStatusChangeDialog = false;
          this.loadServices(
            this.first / this.rows + 1,
            this.rows,
            this.serviceStatus,
            this.searchTerm
          );
        });
    } else {
      console.error('Service ID or new status is undefined');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Service ID or new status is undefined.',
        life: 3000,
      });
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
    if (!this.service.startDate) emptyFields.push('Start Date');
    if (!this.service.endDate) emptyFields.push('End Date');
    return emptyFields;
  }
}
