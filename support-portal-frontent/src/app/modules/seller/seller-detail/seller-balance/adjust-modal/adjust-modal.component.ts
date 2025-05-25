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
  selector: 'app-adjust-modal',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './adjust-modal.component.html',
  styleUrl: './adjust-modal.component.scss'
})
export class AdjustModalComponent {
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
      Debit: [null, [Validators.required]],
      Note: ['', [Validators.maxLength(255), Validators.required]]
    });
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) return;
    
    this.loadingService.showLoading();
    const dto: BalanceTransactionCreateDto = {
      seller_id: this.seller.seller_id,
      debit: this.formGroup.value.Debit,
      amount: this.formGroup.value.Amount,
      note: this.formGroup.value.Note,
      ref_id: '',
      // below fields will be filled by backend
      tx_code: 'ADJUSTMENT',
      created_by: '',
      order_id: null,
    };
    const sub = this.sellerService.adjustBalance(dto)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      if(res.Status != ResponseStatus.Success) {
        console.error(res);
        this.toast.showError(res.Message);
        return;
      }
      this.toast.showSuccess('Adjustment successful');
      this.activeModal.close();
    })
    this.subscriptions.push(sub);
  }
}
