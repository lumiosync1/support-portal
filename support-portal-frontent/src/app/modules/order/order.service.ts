import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderDetailDto } from './_models/OrderDetailDto';
import { BaseResponse } from '../shared/models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  readonly OrdersOdataUrl = `${environment.backendUrl}/odata/OrdersOdata`;
  readonly OrderImportsOdataUrl = `${environment.backendUrl}/odata/OrderImportsOdata`;

  constructor(
    private http: HttpClient
  ) { }

  getOrderDetail(orderId: number): Observable<BaseResponse<OrderDetailDto>> {
    return this.http.get<BaseResponse<OrderDetailDto>>(`${environment.backendUrl}/api/orders/${orderId}`);
  }

  cancelOrder(orderId: number, reason: string, refundBalance: boolean): Observable<BaseResponse<string>> {
    let url: string = `${environment.backendUrl}/api/orders/${orderId}/cancel`;
    const form: FormData = new FormData();
    form.append('reason', reason);
    form.append('refundBalance', refundBalance.toString());
    return this.http.post<BaseResponse<string>>(url, form);
  }

  returnOrder(orderId: number, reason: string, refundBalance: boolean): Observable<BaseResponse<string>> {
    let url: string = `${environment.backendUrl}/api/orders/${orderId}/return`;
    const form: FormData = new FormData();
    form.append('reason', reason);
    form.append('refundBalance', refundBalance.toString());
    return this.http.post<BaseResponse<string>>(url, form);
  }
}
