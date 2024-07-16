import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardDto } from '../interfaces/models/dashboard';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardDto> {
    return this.http.get<DashboardDto>(
      `${environment.BACKEND_API_URL}/api/dashboard`
    );
  }
}
