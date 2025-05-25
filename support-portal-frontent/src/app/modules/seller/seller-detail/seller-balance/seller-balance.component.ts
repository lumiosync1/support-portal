import { Component, inject, ViewChild } from '@angular/core';
import { SellerService } from '../../seller.service';
import { SellerDto } from '../../_models/SellerDto';
import { finalize, Subscription } from 'rxjs';
import { FilterService, FilterSettingsModel, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { CurrencyPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { NgbDropdownModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TopupModalComponent } from './topup-modal/topup-modal.component';
import { WithdrawModalComponent } from './withdraw-modal/withdraw-modal.component';
import { AdjustModalComponent } from './adjust-modal/adjust-modal.component';

@Component({
  selector: 'app-seller-balance',
  standalone: true,
  imports: [CurrencyPipe, GridModule, NgbModalModule, NgbDropdownModule],
  providers: [SortService, FilterService, PageService],
  templateUrl: './seller-balance.component.html',
  styleUrl: './seller-balance.component.scss'
})
export class SellerBalanceComponent {
  private authService = inject(AuthService);
  private sellerService = inject(SellerService);
  private loadingService = inject(LoadingService);
  private toast = inject(ToastService);
  private modalService = inject(NgbModal);
  @ViewChild('grid') grid: GridComponent;

  private subscriptions: Subscription[] = [];

  seller: SellerDto | null = null;
  balance: number;
  allowTopup: boolean = false;

  data: DataManager;
  filterOptions: FilterSettingsModel = {
    type: 'Menu',
    columns: [],
  };
  public filterParams?: object;

  ngOnInit() {
    this.filterParams = { params: { autofill: false } };
    const role = this.authService.currentUserValue ? this.authService.currentUserValue.Role : 'anonymous';
    this.allowTopup = ['admin', 'manager'].includes(role);

    const sellerSub = this.sellerService.currentSeller.subscribe(res => {
      this.seller = res;
      if(this.seller) {
        this.filterOptions.columns?.push({
          field: 'seller_id',
          operator: 'equal',
          value: this.seller.seller_id
        });
        this.data = new DataManager({
          url: `${environment.backendUrl}/odata/BalanceTransactionsOdata`,
          adaptor: new ODataV4Adaptor(),
          crossDomain: true,
          headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
        });
        
        this.getBalance();
      }
    })
    this.subscriptions.push(sellerSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getBalance() {
    if(!this.seller) return;
    
    this.loadingService.showLoading();
    const sub = this.sellerService.getBalance(this.seller.seller_id)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      if(res.Status != ResponseStatus.Success) {
        this.toast.showError(res.Message);
        return;
      }
      this.balance = Number(res.Data);
    })
    this.subscriptions.push(sub);
  }

  openTopupModal() {
    const modalRef = this.modalService.open(TopupModalComponent, { backdrop: 'static', scrollable: true, size: 'md' });
    modalRef.componentInstance.seller = this.seller;
    modalRef.result.then(
      () => {
        this.getBalance();
        this.grid.refresh();
      },
      () => {}
    );
  }

  openWithdrawModal() {
    const modalRef = this.modalService.open(WithdrawModalComponent, { backdrop: 'static', scrollable: true, size: 'md' });
    modalRef.componentInstance.seller = this.seller;
    modalRef.result.then(
      () => {
        this.getBalance();
        this.grid.refresh();
      },
      () => {}
    );
  }

  openAdjustModal() {
    const modalRef = this.modalService.open(AdjustModalComponent, { backdrop: 'static', scrollable: true, size: 'md' });
    modalRef.componentInstance.seller = this.seller;
    modalRef.result.then(
      () => {
        this.getBalance();
        this.grid.refresh();
      },
      () => {}
    );
  }
}
