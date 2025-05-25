import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { DialogUtility} from '@syncfusion/ej2-angular-popups';
import { SellerService } from '../seller.service';
import { SellerDto } from '../_models/SellerDto';
import { LoadingService } from '../../shared/services/loading.service';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { ToastService } from '../../shared/services/toast.service';
import { PageInfoService } from 'src/app/_metronic/layout';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-seller-detail',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe, NgbDropdownModule],
  templateUrl: './seller-detail.component.html',
  styleUrl: './seller-detail.component.scss'
})
export class SellerDetailComponent {
  private sellerService = inject(SellerService);
  private route = inject(ActivatedRoute);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);
  private page = inject(PageInfoService);

  private subscriptions: Subscription[] = [];
  private disableConfirmDialog: any;
  private enableConfirmDialog: any;

  sellerId: number;
  seller: SellerDto;

  ngOnInit() {
    this.page.updateTitle('Seller Detail');
    const routeSub = this.route.params.subscribe(params => {
      this.sellerId = params['id'];
      this.loadData();
    });
    this.subscriptions.push(routeSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData() {
    this.loadingService.showLoading();
    this.sellerService.getSeller(this.sellerId)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      if(res.Status != ResponseStatus.Success) {
        this.toastService.showError(res.Message);
        return;
      }
      this.seller = res.Data;
      this.sellerService.setCurrentSeller(this.seller);
    });
  }

  confirmDisable() {
    this.disableConfirmDialog = DialogUtility.confirm({
      title: 'Confirm',
      content: `Are you sure you want to disable ${this.seller.seller_name}?`,
      okButton: {
        text: 'Disable',
        click: this.disableSeller.bind(this)
      }
    });
  }

  disableSeller() {
    this.disableConfirmDialog.hide();
    this.loadingService.showLoading();
    this.sellerService.disableSeller(this.sellerId)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      if(res.Status != ResponseStatus.Success) {
        this.toastService.showError(res.Message);
        return;
      }
      this.toastService.showSuccess('Seller disabled successfully');
      this.loadData();
    });
  }

  confirmEnable() {
    this.enableConfirmDialog = DialogUtility.confirm({
      title: 'Confirm',
      content: `Are you sure you want to enable ${this.seller.seller_name}?`,
      okButton: {
        text: 'Enable',
        click: this.enableSeller.bind(this)
      }
    });
  }

  enableSeller() {
    this.enableConfirmDialog.hide();
    this.loadingService.showLoading();
    this.sellerService.enableSeller(this.sellerId)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      if(res.Status != ResponseStatus.Success) {
        this.toastService.showError(res.Message);
        return;
      }
      this.toastService.showSuccess('Seller enabled successfully');
      this.loadData();
    });
  }
}
