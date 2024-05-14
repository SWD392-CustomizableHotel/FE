import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { User } from '../interfaces/models/user';
import { Auth } from '../../assets/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${environment.BACKEND_API_URL}/${Auth.AUTH}/${Auth.USER}`);
  }
}
