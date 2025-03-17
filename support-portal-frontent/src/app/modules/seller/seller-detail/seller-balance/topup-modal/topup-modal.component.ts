import { Component, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerDto } from '../../../_models/SellerDto';
import { SellerService } from '../../../seller.service';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { BalanceTransactionCreateDto } from '../../../_models/BalanceTransactionCreateDto';

@Component({
  selector: 'app-topup-modal',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './topup-modal.component.html',
  styleUrl: './topup-modal.component.scss'
})
export class TopupModalComponent {
  private sellerService = inject(SellerService);
  private loadingService = inject(LoadingService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  public activeModal = inject(NgbActiveModal);

  private subscriptions: Subscription[] = [];
  
  @Input() seller: SellerDto;
  formGroup: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm() {
    this.formGroup = this.fb.group({
      Amount: [0, [Validators.required, Validators.min(1)]],
      RefId: ['', [Validators.maxLength(255), Validators.required]],
      Note: ['', [Validators.maxLength(255)]]
    });
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) return;
    
    this.loadingService.showLoading();
    const dto: BalanceTransactionCreateDto = {
      seller_id: this.seller.seller_id,
      amount: this.formGroup.value.Amount,
      ref_id: this.formGroup.value.RefId,
      note: this.formGroup.value.Note,
      // below fields will be filled by backend
      created_by: '',
      debit: false,
      order_id: null,
      tx_code: 'TOPUP'
    };
    const sub = this.sellerService.topup(dto)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      if(res.Status != ResponseStatus.Success) {
        this.toast.showError(res.Message);
        return;
      }
      this.toast.showSuccess('Topup successful');
      this.activeModal.close();
    })
    this.subscriptions.push(sub);
  }

}
