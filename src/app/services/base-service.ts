import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  public baseUrl = environment.BACKEND_API_URL;
  constructor(protected httpClient: HttpClient) {}
}