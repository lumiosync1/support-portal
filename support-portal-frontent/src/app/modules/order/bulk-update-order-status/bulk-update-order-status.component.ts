import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../shared/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageInfoService } from 'src/app/_metronic/layout';
import { OrderService } from '../order.service';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { finalize } from 'rxjs/operators';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { BulkUpdateStatusDto } from '../_models/BulkUpdateStatusDto';
import { NgIf } from '@angular/common';
import { OrderStatus } from '../_others/order-statuses';

@Component({
  selector: 'app-bulk-update-order-status',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './bulk-update-order-status.component.html',
  styleUrl: './bulk-update-order-status.component.scss'
})
export class BulkUpdateOrderStatusComponent {
  private loadingService = inject(LoadingService);
  private modalService = inject(NgbModal);
  private orderService = inject(OrderService);
  private page = inject(PageInfoService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  private subscriptions: Subscription[] = [];

  formGroup: FormGroup;
  toPending: boolean = false;

  ngOnInit(): void {
    this.page.updateTitle('Bulk Update Order Status');
    this.formGroup = this.fb.group({
      NewStatus: ['', [Validators.required]],
      Reason: ['', [Validators.required]],
      OrderIds: ['', [Validators.required]],
    });
    this.formGroup.get('NewStatus')?.valueChanges.subscribe(value => this.onNewStatusChange(value));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      return;
    }

    this.loadingService.showLoading();

    const formValue = this.formGroup.value;
    const ids = formValue.OrderIds.replace(/[\r\n]+/g, ',');
    const dto: BulkUpdateStatusDto = {
      NewStatus: formValue.NewStatus,
      Reason: formValue.Reason,
      OrderIds: ids.split(',').map((id:string) => Number(id)),
    }
    const sub = this.orderService.bulkUpdateOrderStatus(dto)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Order status updated successfully');
    });

    this.subscriptions.push(sub);
  }

  onNewStatusChange(value: string) {
    if(value === OrderStatus.Pending) {
      this.toPending = true;
    } else {
      this.toPending = false;
    }
  }
}
