import { ChangeDetectorRef, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FilterService, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { PageInfoService } from 'src/app/_metronic/layout';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize } from 'rxjs/operators';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-supplier-account-queue',
  standalone: true,
  imports: [GridModule, NgbDropdownModule, JsonPipe],
  providers: [SortService, FilterService, PageService],
  templateUrl: './supplier-account-queue.component.html',
  styleUrl: './supplier-account-queue.component.scss'
})
export class SupplierAccountQueueComponent {
  private page = inject(PageInfoService);
  private http = inject(HttpClient);
  private ref = inject(ChangeDetectorRef);
  private loadingService = inject(LoadingService);
  private modalService = inject(NgbModal);
  
  @ViewChild('detailModal') detailModal: TemplateRef<any>;

  data: Object[] = [];
  activeAccounts: number;
  maxOrders24h: number;
  selectedAccount: any;

  ngOnInit(): void {
    this.page.updateTitle('Supplier Account Queue');
    this.loadData();
  }

  loadData() {
    this.loadingService.showLoading();
    this.http.get(`https://amzk9f9c6e.execute-api.us-east-1.amazonaws.com/prod/supplier-accounts/queue`)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      let accounts = res as any[];
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if(!account.last_purchase_time.endsWith('Z')) {
          account.last_purchase_time += 'Z';
        }
        if(!account.last_tracking_time.endsWith('Z')) {
          account.last_tracking_time += 'Z';
        }
        account.last_purchase_time = new Date(account.last_purchase_time);
        account.last_tracking_time = new Date(account.last_tracking_time);

        for(let j = 0; j < account.orders.length; j++) {
          let order = account.orders[j];
          if(!order.endsWith('Z')) {
            order += 'Z';
          }
          account.orders[j] = new Date(order);
        }

        account.orders_1h = account.orders.filter((o: Date) => o >= new Date(Date.now() - 1 * 60 * 60 * 1000));
        account.orders_2h = account.orders.filter((o: Date) => o >= new Date(Date.now() - 2 * 60 * 60 * 1000));
        account.orders_4h = account.orders.filter((o: Date) => o >= new Date(Date.now() - 4 * 60 * 60 * 1000));
        account.orders_12h = account.orders.filter((o: Date) => o >= new Date(Date.now() - 12 * 60 * 60 * 1000));
        account.orders_24h = account.orders.filter((o: Date) => o >= new Date(Date.now() - 24 * 60 * 60 * 1000));

        account.limit1h = account.protection_settings.MaxOrders1Hour && account.orders_1h.length >= account.protection_settings.MaxOrders1Hour;
        account.limit2h = account.protection_settings.MaxOrders2Hour && account.orders_2h.length >= account.protection_settings.MaxOrders2Hour;
        account.limit4h = account.protection_settings.MaxOrders4Hour && account.orders_4h.length >= account.protection_settings.MaxOrders4Hour;
        account.limit12h = account.protection_settings.MaxOrders12Hour && account.orders_12h.length >= account.protection_settings.MaxOrders12Hour;
        account.limit24h = account.protection_settings.MaxOrders24Hour && account.orders_24h.length >= account.protection_settings.MaxOrders24Hour;

        // available at
        let availableAt = new Date();
        if(account.limit1h && new Date(new Date(account.orders_1h[0]).getTime() + 60 * 60 * 1000) > availableAt){
          availableAt = new Date(new Date(account.orders_1h[0]).getTime() + 60 * 60 * 1000);
        }
        if(account.limit2h && new Date(new Date(account.orders_2h[0]).getTime() + 2 * 60 * 60 * 1000) > availableAt){
          availableAt = new Date(new Date(account.orders_2h[0]).getTime() + 2 * 60 * 60 * 1000);
        }
        if(account.limit4h && new Date(new Date(account.orders_4h[0]).getTime() + 4 * 60 * 60 * 1000) > availableAt){
          availableAt = new Date(new Date(account.orders_4h[0]).getTime() + 4 * 60 * 60 * 1000);
        }
        if(account.limit12h && new Date(new Date(account.orders_12h[0]).getTime() + 12 * 60 * 60 * 1000) > availableAt){
          availableAt = new Date(new Date(account.orders_12h[0]).getTime() + 12 * 60 * 60 * 1000);
        }
        if(account.limit24h && new Date(new Date(account.orders_24h[0]).getTime() + 24 * 60 * 60 * 1000) > availableAt){
          availableAt = new Date(new Date(account.orders_24h[0]).getTime() + 24 * 60 * 60 * 1000);
        }
        if(account.on_hold_to) {
          const onHoldTo = new Date(account.on_hold_to);
          if(availableAt < onHoldTo) {
            availableAt = onHoldTo;
          }
        }
        account.available_at = availableAt;

        if(!account.allow_purchase) {
          account.available_at = new Date(Date.now() + 48 * 60 * 60 * 1000);
        }
      }
      this.data = accounts;
      const activeAccountList = accounts.filter((account: any) => account.allow_purchase);
      this.activeAccounts = activeAccountList.length;
      this.maxOrders24h = activeAccountList.reduce((acc, account) => acc + account.protection_settings.MaxOrders24Hour, 0);
      this.ref.detectChanges();
    });
  }

  reloadQueue() {
    this.loadingService.showLoading();
    this.http.post(`https://amzk9f9c6e.execute-api.us-east-1.amazonaws.com/prod/supplier-accounts/reload`, null)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      this.loadData();
    });
  }

  markIdle(account_id: number) {
    this.loadingService.showLoading();
    this.http.post(`https://amzk9f9c6e.execute-api.us-east-1.amazonaws.com/prod/supplier-accounts/${account_id}/idle`, null)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      this.loadData();
    });
  }

  hold(account_id: number) {
    this.loadingService.showLoading();
    const formData = new FormData();
    formData.append('duration', '30');
    this.http.post(`https://amzk9f9c6e.execute-api.us-east-1.amazonaws.com/prod/supplier-accounts/${account_id}/hold`, formData)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      this.loadData();
    });
  }

  resetLastTrackingTime(account_id: number) {
    this.loadingService.showLoading();
    const formData = new FormData();
    // set last tracking time to 7 hours ago
    formData.append('time', new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString());
    this.http.post(`https://amzk9f9c6e.execute-api.us-east-1.amazonaws.com/prod/supplier-accounts/${account_id}/last-tracking-time`, formData)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      this.loadData();
    });
  }

  openDetail(account: any) {
    this.selectedAccount = account;
    this.modalService.open(this.detailModal);
  }
}
