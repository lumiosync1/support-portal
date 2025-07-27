import { Component, inject, Input, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { OrderService } from '../../order.service';
import { CancelRequestApproveDto } from '../../_models/CancelRequestApproveDto';

@Component({
  selector: 'app-cancel-request-approve',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './cancel-request-approve.component.html',
  styleUrl: './cancel-request-approve.component.scss'
})
export class CancelRequestApproveComponent {
fb = inject(FormBuilder);
  activeModal = inject(NgbActiveModal);
  orderService = inject(OrderService);
  toast = inject(ToastService);
  spinner = inject(LoadingService);  
  @Input() orderId: number;

  subscriptions: Subscription[] = [];
  formGroup: FormGroup;

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      order_id: [this.orderId, Validators.required],
      note: [''],
      refund_order_price: [false, Validators.required],
      refund_processing_fee: [false, Validators.required]
    });
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }

    const dto: CancelRequestApproveDto = Object.assign({}, this.formGroup.value);

    this.spinner.showLoading();
    const sub = this.orderService.approveCancelRequest(dto)
    .pipe(finalize(() => this.spinner.hideLoading()))
    .subscribe(response => {
      if (response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Cancel request approved successfully');
      this.activeModal.close(true);
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
