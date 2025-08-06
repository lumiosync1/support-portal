import { Component, inject, Input, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { OrderService } from '../../order.service';
import { ReturnRequestFinishDto } from '../../_models/ReturnRequestFinishDto';

@Component({
  selector: 'app-return-request-finish',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './return-request-finish.component.html',
  styleUrl: './return-request-finish.component.scss'
})
export class ReturnRequestFinishComponent {
fb = inject(FormBuilder);
  activeModal = inject(NgbActiveModal);
  orderService = inject(OrderService);
  toast = inject(ToastService);
  spinner = inject(LoadingService);  
  @Input() order: any;

  subscriptions: Subscription[] = [];
  formGroup: FormGroup;

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      order_id: [this.order.order_id, Validators.required],
      note: [this.order.note],
      refund_order_price: [true, Validators.required],
      refund_processing_fee: [false, Validators.required],
    });
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }

    const dto: ReturnRequestFinishDto = Object.assign({}, this.formGroup.value);

    this.spinner.showLoading();
    const sub = this.orderService.finishReturnRequest(dto)
    .pipe(finalize(() => this.spinner.hideLoading()))
    .subscribe(response => {
      if (response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Return request finished successfully');
      this.activeModal.close(true);
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
