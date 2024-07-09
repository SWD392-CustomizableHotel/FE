/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AmenityService } from '../../../../services/amenity.service';
import { MessageService } from 'primeng/api';
import { Amenity } from '../../../../interfaces/models/amenity';
import { Hotel } from '../../../../interfaces/models/hotels';
import { HotelService } from '../../../../services/hotel.service';
import { Table } from 'primeng/table';

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
  selector: 'app-manage-amenities',
  templateUrl: './manage-amenities.component.html',
  styleUrls: ['./manage-amenities.component.scss'],
  providers: [MessageService],
})
export class ManageAmenitiesComponent implements OnInit {
  isEdit: boolean = false;
  amenityDialog: boolean = false;
  createAmenityDialog: boolean = false;
  deleteAmenityDialog: boolean = false;
  amenityDetailsDialog: boolean = false;
  selectedAmenityDetails: Amenity | null = null;
  submitted: boolean = false;
  loading: boolean = true;
  amenities: Amenity[] = [];
  amenity: Amenity = {};
  hotels: Hotel[] = [];
  expandedRows: ExpandedRows = {};
  cols: any[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  rowsPerPageOptions = [5, 10, 20];
  searchTerm?: string;
  amenityStatus?: string;
  amenityStatusOptions = [
    { status: 'Normal' },
    { status: 'Old' },
    { status: 'Out Of Stock' },
    { status: 'Broken' },
    { status: 'Repairing' },
  ];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];
  selectedAmenityStatus: { status: string } | undefined;
  @ViewChild('filter') filter!: ElementRef;
  constructor(
    private amenityService: AmenityService,
    private hotelService: HotelService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAmenities(1, this.rows, this.amenityStatus, this.searchTerm);
    this.cols = [
      { field: 'id', header: 'Amenity ID' },
      { field: 'name', header: 'Name' },
      { field: 'price', header: 'Price' },
      { field: 'hotelId', header: 'Hotel' },
      { field: 'capacity', header: 'Capacity' },
    ];
    this.loadHotels();
  }

  private loadAmenities(
    pageNumber: number,
    pageSize: number,
    amenityStatus?: string,
    searchTerm?: string
  ): void {
    this.loading = true;
    this.amenityService
      .getAllAmenities(pageNumber, pageSize, amenityStatus, searchTerm)
      .subscribe({
        next: (data) => {
          this.amenities = data.data
            .map((amenity: Amenity) => {
              return {
                ...amenity,
                amenityStatus: this.amenityStatusOptions.find(
                  (option) => option.status === amenity.status
                ),
              };
            })
            .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
          this.loading = false;
          this.totalRecords = data.totalRecords;
          this.totalPages = data.totalPages;
          console.log(this.amenities);
        },
        error: (error) => {
          this.loading = false;
          console.error('There was an error!', error);
        },
      });
  }

  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe((data) => {
      this.hotels = data.data;
    });
  }

  openNew(): void {
    this.amenity = { status: 'Normal' };
    this.selectedAmenityStatus = { status: 'Normal' };
    this.submitted = false;
    this.createAmenityDialog = true;
  }

  editAmenity(amenity: Amenity): void {
    this.amenity = { ...amenity };
    this.selectedAmenityStatus = this.amenityStatusOptions.find(
      (option) => option.status === amenity.status
    );
    this.isEdit = true;
    this.amenityDialog = true;
  }

  hideDialog(): void {
    this.amenityDialog = false;
    this.submitted = false;
    this.createAmenityDialog = false;
  }

  deleteAmenity(amenity: Amenity): void {
    if ((amenity.inUse ?? 0) > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot delete an amenity while it is InUse.',
        life: 3000,
      });
      return;
    }
    this.deleteAmenityDialog = true;
    this.amenity = { ...amenity };
  }

  viewAmenityDetails(amenity: Amenity): void {
    const amenityId = amenity.id;
    if (amenityId !== undefined) {
      this.amenityService.getAmenityDetails(amenityId).subscribe({
        next: (response) => {
          this.selectedAmenityDetails = response.data;
          this.amenityDetailsDialog = true;
        },
        error: (error) => {
          console.error('Error fetching amenity details:', error);
        },
      });
    } else {
      console.error('Amenity ID is undefined.');
    }
  }

  hideAmenityDetailsDialog(): void {
    this.amenityDetailsDialog = false;
    this.selectedAmenityDetails = null;
  }

  confirmDelete(): void {
    this.deleteAmenityDialog = false;
    if (this.amenity.id !== undefined) {
      if (
        this.selectedAmenityStatus?.status !== 'Broken' &&
        this.selectedAmenityStatus?.status !== 'Repairing'
      ) {
        this.amenityService.deleteAmenity(this.amenity.id).subscribe(
          () => {
            this.amenities = this.amenities.filter(
              (val) => val.id !== this.amenity.id
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Amenity Deleted',
              life: 3000,
            });
            this.loadAmenities(
              this.first / this.rows + 1,
              this.rows,
              this.amenityStatus,
              this.searchTerm
            );
          },
          (error) => {
            console.error('Error deleting amenity:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error occurred while deleting the amenity.',
              life: 3000,
            });
          }
        );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot delete a broken or repairing amenity.',
          life: 3000,
        });
      }
    } else {
      console.error('Amenity ID is undefined');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Amenity ID is undefined.',
        life: 3000,
      });
    }
  }

  saveAmenity(): void {
    this.submitted = true;
    const emptyFields = this.getEmptyFields();
    if (emptyFields.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `The following fields must be filled out to create an amenity: ${emptyFields.join(
          ', '
        )}`,
        life: 3000,
      });
    } else if (this.amenity.price === undefined || this.amenity.price < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Price cannot be negative or undefined.',
        life: 3000,
      });
    } else if (
      this.amenity.capacity === undefined ||
      this.amenity.capacity < 0
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Capacity cannot be negative or undefined.',
        life: 3000,
      });
    } else if (this.amenity.inUse === undefined || this.amenity.inUse < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'InUse cannot be negative or undefined.',
        life: 3000,
      });
    } else if (this.amenity.inUse > this.amenity.capacity) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'InUse cannot be greater than Capacity.',
        life: 3000,
      });
    } else {
      if (this.amenity.id !== undefined) {
        // Update existing amenity
        this.amenityService
          .updateAmenity(
            this.amenity.id,
            this.amenity.name || '',
            this.amenity.description || '',
            this.amenity.price || 0,
            this.amenity.capacity || 0,
            this.amenity.inUse || 0
          )
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Amenity Updated',
              life: 3000,
            });
            this.loadAmenities(
              this.first / this.rows + 1,
              this.rows,
              this.amenityStatus,
              this.searchTerm
            );
          });
      } else {
        // Create new amenity
        this.amenity.status = this.selectedAmenityStatus?.status || 'Normal';
        if (
          this.amenity.name &&
          this.amenity.price !== undefined &&
          this.amenity.description &&
          this.amenity.status &&
          this.amenity.hotelId
        ) {
          if (this.selectedAmenityStatus) {
            this.amenity.status = this.selectedAmenityStatus.status;
          }
          this.amenityService
            .createAmenity(
              this.amenity.name,
              this.amenity.description,
              this.amenity.price,
              this.amenity.status,
              this.amenity.hotelId,
              this.amenity.capacity || 0,
              this.amenity.inUse || 0
            )
            .subscribe(
              (newAmenity) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Amenity Created',
                  life: 3000,
                });
                this.amenities.unshift(newAmenity.data);
                this.loadAmenities(
                  this.first / this.rows + 1,
                  this.rows,
                  this.amenityStatus,
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
    }
    this.isEdit = false;
    this.createAmenityDialog = false;
    this.amenityDialog = false;
    this.amenity = {};
  }

  updateAmenityStatus(amenity: Amenity, newStatus: any): void {
    const statusString = newStatus.status;
    if (amenity.id !== undefined) {
      this.amenityService
        .updateAmenityStatus(amenity.id, statusString)
        .subscribe();
    } else {
      console.error('Amenity ID is undefined');
    }
  }

  onGlobalFilter(dt1: any, event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    console.log(this.searchTerm);
    this.loadAmenities(1, this.rows, this.amenityStatus, this.searchTerm);
  }

  clear(table: Table): void {
    table.clear();
    this.filter.nativeElement.value = '';
    this.searchTerm = undefined;
    this.loadAmenities(1, this.rows, this.amenityStatus, this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    this.first = event.first || 0;
    this.rows = event.rows || 10;
    const pageNumber = this.first / this.rows + 1;
    this.loadAmenities(
      pageNumber,
      this.rows,
      this.amenityStatus,
      this.searchTerm
    );
  }

  onRowsChange(newRows: number): void {
    this.first = 0;
    this.rows = newRows;
    this.loadAmenities(1, this.rows, this.amenityStatus, this.searchTerm);
  }

  private getEmptyFields(): string[] {
    const emptyFields = [];
    if (!this.isEdit) {
      if (!this.amenity.name) emptyFields.push('Name');
      if (!this.amenity.price) emptyFields.push('Price');
      if (!this.amenity.description) emptyFields.push('Description');
      if (!this.selectedAmenityStatus?.status) emptyFields.push('Status');
      if (!this.amenity.hotelId) emptyFields.push('Hotel');
    }
    if (this.isEdit) {
      if (this.amenity.name && !this.amenity.name.trim())
        emptyFields.push('Name');
      if (this.amenity.price && isNaN(this.amenity.price))
        emptyFields.push('Price');
    }
    return emptyFields;
  }
}