import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../shared/models/base-response.model';
import { SupplierAccountAddDto } from './_models/SupplierAccountAddDto';
import { SupplierAccountUpdateDto } from './_models/SupplierAccountUpdateDto';
import { SupplierAccountUpdateInitDataDto } from './_models/SupplierAccountUpdateInitDataDto';

@Injectable({
  providedIn: 'root'
})
export class SupplierAccountService {

  constructor(private http: HttpClient) { }

  initDataUpdate(account_id: number): Observable<BaseResponse<SupplierAccountUpdateInitDataDto>> {
    return this.http.get<BaseResponse<SupplierAccountUpdateInitDataDto>>(`${environment.backendUrl}/api/SupplierAccounts/${account_id}/init-data-update`);
  }

  update(dto: SupplierAccountUpdateDto): Observable<BaseResponse<string>> {
    return this.http.put<BaseResponse<string>>(`${environment.backendUrl}/api/SupplierAccounts`, dto);
  }

  delete(account_id: number): Observable<BaseResponse<string>> {
    return this.http.delete<BaseResponse<string>>(`${environment.backendUrl}/api/SupplierAccounts/${account_id}`);
  }

  create(dto: SupplierAccountAddDto): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${environment.backendUrl}/api/SupplierAccounts`, dto);
  }
}
