import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FilterService, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { PageInfoService } from 'src/app/_metronic/layout';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-supplier-account-queue',
  standalone: true,
  imports: [GridModule],
  providers: [SortService, FilterService, PageService],
  templateUrl: './supplier-account-queue.component.html',
  styleUrl: './supplier-account-queue.component.scss'
})
export class SupplierAccountQueueComponent {
  private page = inject(PageInfoService);
  private http = inject(HttpClient);
  private ref = inject(ChangeDetectorRef);
  private loadingService = inject(LoadingService);
  
  data: Object[] = [];

  ngOnInit(): void {
    this.page.updateTitle('Supplier Account Queue');
    this.loadData();
  }

  loadData() {
    this.loadingService.showLoading();
    this.http.get(`http://services.lumiosync.com:5205/accounts/print`)
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

        account.orders_24h = account.orders.filter((o: Date) => o >= new Date(Date.now() - 24 * 60 * 60 * 1000));
        account.orders_1h = account.orders.filter((o: Date) => o >= new Date(Date.now() - 1 * 60 * 60 * 1000));

        account.limit1h = account.orders_1h.length >= account.protection_settings.MaxOrders1Hour;
        account.limit24h = account.orders_24h.length >= account.protection_settings.MaxOrders24Hour;

        // available at
        if(account.limit1h){
          account.available_at = new Date(account.last_purchase_time.getTime() + 60 * 60 * 1000);
        }
        if(account.limit24h){
          let oldest = account.orders_24h[0] as Date;
          const avai = new Date(oldest.getTime() + 24 * 60 * 60 * 1000)
          
          if(account.available_at) {
            if(account.available_at < avai) {
              account.available_at = avai;
            }
          } else {
            account.available_at = avai;
          }
        }
        if(account.on_hold_to) {
          const onHoldTo = new Date(account.on_hold_to);
          if(account.available_at) {
            if(account.available_at < onHoldTo) {
              account.available_at = onHoldTo;
            }
          } else {
            account.available_at = onHoldTo;
          }
        }
        if(!account.allow_purchase) {
          account.available_at = new Date(Date.now() + 48 * 60 * 60 * 1000);
        }
        if(!account.available_at) {
          account.available_at = new Date();
        }
      }
      this.data = accounts;
      this.ref.detectChanges();
    });
  }

  reloadQueue() {
    this.loadingService.showLoading();
    this.http.post(`http://services.lumiosync.com:5205/accounts/reload`, null)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      this.loadData();
    });
  }
}
