import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../shared/models/base-response.model';
import { SellerDto } from './_models/SellerDto';
import { BalanceTransactionCreateDto } from './_models/BalanceTransactionCreateDto';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private sellerSource = new BehaviorSubject<SellerDto | null>(null);
  currentSeller = this.sellerSource.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  setCurrentSeller(seller: SellerDto | null) {
    this.sellerSource.next(seller);
  }

  getSeller(id: number): Observable<BaseResponse<SellerDto>> {
    return this.http.get<BaseResponse<SellerDto>>(`${environment.backendUrl}/api/sellers/${id}`);
  }

  disableSeller(id: number): Observable<BaseResponse<string>> {
    return this.http.delete<BaseResponse<string>>(`${environment.backendUrl}/api/sellers/${id}/status`);
  }

  enableSeller(id: number): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${environment.backendUrl}/api/sellers/${id}/status`, {});
  }

  getBalance(id: number): Observable<BaseResponse<string>> {
    return this.http.get<BaseResponse<string>>(`${environment.backendUrl}/api/sellers/${id}/balance`);
  }

  topup(dto: BalanceTransactionCreateDto): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${environment.backendUrl}/api/sellers/${dto.seller_id}/balance`, dto);
  }

  getSetting(sellerId: number, key: string): Observable<BaseResponse<string>> {
    return this.http.get<BaseResponse<string>>(`${environment.backendUrl}/api/sellers/${sellerId}/settings?key=${key}`);
  }
}
