import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../order.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';

@Component({
  selector: 'app-cancel-order-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './cancel-order-modal.component.html',
  styleUrl: './cancel-order-modal.component.scss'
})
export class CancelOrderModalComponent {
  orderId: number;
  formGroup: FormGroup;
  activeModal = inject(NgbActiveModal);

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private spinner = inject(LoadingService);

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formGroup = this.fb.group({
      Reason: ['', Validators.required],
      RefundBalance: [true]
    })
  }

  cancelOrder() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid)
    {
      this.toast.showError('Please fill in all required fields');
      return;
    }

    this.spinner.showLoading();
    const formValues = this.formGroup.value;
    this.orderService.cancelOrder(this.orderId, formValues.Reason, formValues.RefundBalance)
      .pipe(finalize(() => this.spinner.hideLoading()))
      .subscribe({
        next: (response) => {
          if(response.Status != ResponseStatus.Success)
          {
            this.toast.showError(response.Message);
            return;
          }

          this.toast.showSuccess('Order cancelled successfully');
          this.activeModal.close(true);
        },
        error: (error) => {
          this.toast.showError(error);
        }
      })
  }
}
