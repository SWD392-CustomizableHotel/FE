import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';
import { Service } from '../interfaces/models/service';

interface ServiceResponse {
  data: Service;
  errors: any;
  isSucceeded: boolean;
  message: string;
}

interface PagedServiceResponse {
  data: Service[];
  totalRecords: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private http: HttpClient) {}

  getAllServices(
    pageNumber: number,
    pageSize: number,
    status?: string,
    searchTerm?: string
  ): Observable<PagedServiceResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== '') {
      params = params.set('status', status);
    }

    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PagedServiceResponse>(
      `${environment.BACKEND_API_URL}/api/Services/get-all-services`,
      { params }
    );
  }

  getServiceDetails(serviceId: number): Observable<ServiceResponse> {
    const url = `${environment.BACKEND_API_URL}/api/Services/get-service-by-id/${serviceId}`;
    return this.http.get<ServiceResponse>(url);
  }

  createService(
    name: string,
    description: string,
    price: number,
    status: string,
    startDate: string,
    endDate: string,
    hotelId: number
  ): Observable<ServiceResponse> {
    const url = `${environment.BACKEND_API_URL}/api/Services/create-service`;
    const body = {
      name,
      description,
      price,
      status,
      startDate,
      endDate,
      hotelId,
    };
    return this.http.post<ServiceResponse>(url, body);
  }

  updateService(
    serviceId: number,
    name: string,
    description: string,
    price: number,
    startDate: string,
    endDate: string
  ): Observable<ServiceResponse> {
    const url = `${environment.BACKEND_API_URL}/api/Services/update-service`;
    const body = { serviceId, name, description, price, startDate, endDate };
    return this.http.put<ServiceResponse>(url, body);
  }

  updateServiceStatus(
    serviceId: number,
    status: string
  ): Observable<ServiceResponse> {
    const url = `${environment.BACKEND_API_URL}/api/Services/update-service-status?serviceId=${serviceId}&status=${status}`;
    return this.http.put<ServiceResponse>(url, {});
  }

  deleteService(serviceId: number): Observable<void> {
    const url = `${environment.BACKEND_API_URL}/api/Services/delete-service/${serviceId}`;
    return this.http.delete<void>(url);
  }

  getServicesByRoomId(roomId: number): Observable<Service[]> {
    const url = `${environment.BACKEND_API_URL}/api/Services/get-room-service/${roomId}`;
    return this.http.get<Service[]>(url);
  }

  assignStaffToService(
    serviceId: number,
    staffIds: string[]
  ): Observable<void> {
    const url = `${environment.BACKEND_API_URL}/api/Services/assign-staff`;
    const body = { serviceId, staffIds };
    return this.http.post<void>(url, body);
  }
  removeStaffAssignments(serviceId: number): Observable<void> {
    const url = `${environment.BACKEND_API_URL}/api/Services/remove-staff-assignments`;
    const body = { serviceId };
    return this.http.post<void>(url, body);
  }
}
