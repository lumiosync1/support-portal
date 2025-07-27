import { Component, inject, Input, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { OrderService } from '../../order.service';
import { CancelRequestRejectDto } from '../../_models/CancelRequestRejectDto';

@Component({
  selector: 'app-cancel-request-reject',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './cancel-request-reject.component.html',
  styleUrl: './cancel-request-reject.component.scss'
})
export class CancelRequestRejectComponent implements OnDestroy {
  fb = inject(FormBuilder);
  activeModal = inject(NgbActiveModal);
  orderService = inject(OrderService);
  toast = inject(ToastService);
  spinner = inject(LoadingService);  
  @Input() orderId: number;

  subscriptions: Subscription[] = [];
  formGroup = this.fb.group({
    note: ['', Validators.required]
  });

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }

    const dto: CancelRequestRejectDto = {
      order_id: this.orderId,
      note: this.formGroup.value.note??''
    };

    this.spinner.showLoading();
    const sub = this.orderService.rejectCancelRequest(dto)
    .pipe(finalize(() => this.spinner.hideLoading()))
    .subscribe(response => {
      if (response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Cancel request rejected successfully');
      this.activeModal.close(true);
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
