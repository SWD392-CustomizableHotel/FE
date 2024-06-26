import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../interfaces/models/account';
import { BaseResponse } from '../interfaces/models/base-response';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccounts(
    pageNumber: number,
    pageSize: number,
    userName?: string,
    email?: string,
    searchTerm?: string
  ): Observable<BaseResponse<Account>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (userName && userName !== '') {
      params = params.set('UserName', userName);
    }
    if (email && email !== '') {
      params = params.set('Email', email);
    }
    if (searchTerm && searchTerm !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get<BaseResponse<Account>>(
      `${environment.BACKEND_API_URL}/api/Account`,
      { params }
    );
  }

  getAccountDetail(accountId: string): Observable<BaseResponse<Account>> {
    return this.http.get<BaseResponse<Account>>(
      `${environment.BACKEND_API_URL}/api/Account/${accountId}`
    );
  }

  updateAccount(
    accountId: string,
    accountToUpdate: Account
  ): Observable<BaseResponse<Account>> {
    return this.http.put<BaseResponse<Account>>(
      `${environment.BACKEND_API_URL}/api/Account/${accountId}`,
      accountToUpdate
    );
  }

  deleteAccount(accountId: string): Observable<BaseResponse<Account>> {
    return this.http.delete<BaseResponse<Account>>(
      `${environment.BACKEND_API_URL}/api/Account/${accountId}`
    );
  }
}
