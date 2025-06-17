import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/_metronic/layout';
import { ToastService } from '../../shared/services/toast.service';
import { SupplierAccountAddDto } from '../_models/SupplierAccountAddDto';
import { Router } from '@angular/router';
import { SupplierAccountService } from '../supplier-account.service';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize } from 'rxjs/operators';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-supplier-account-add',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './supplier-account-add.component.html',
  styleUrl: './supplier-account-add.component.scss'
})
export class SupplierAccountAddComponent {
  private subscriptions: Subscription[] = [];
  private fb = inject(FormBuilder);
  private page = inject(PageInfoService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private supplierAccountService = inject(SupplierAccountService);
  private loadingService = inject(LoadingService);

  formGroup: FormGroup;

  ngOnInit(): void {
    this.page.updateTitle('Add Supplier Account');
    this.createForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  createForm() {
    this.formGroup = this.fb.group({
      account_name: ['', [Validators.required]],
      account_password: ['', [Validators.required]],
      ml_profile: ['', [Validators.required]],
      supplier: ['', [Validators.required]],
      site: ['', [Validators.required]],
      max_orders_1h: [null, [Validators.required]],
      max_orders_24h: [null, [Validators.required]],
    })
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      this.toast.showError('Please fill in all required fields');
      return;
    }
    
    const formValue = this.formGroup.value;
    const dto: SupplierAccountAddDto = {
      account_name: formValue.account_name,
      account_password: formValue.account_password,
      ml_profile: formValue.ml_profile,
      supplier: formValue.supplier,
      site: formValue.site,
      protection_settings: JSON.stringify({
        MaxOrders1Hour: formValue.max_orders_1h,
        MaxOrders24Hour: formValue.max_orders_24h
      })
    };
    this.loadingService.showLoading();
    const sub = this.supplierAccountService.create(dto)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      if(res.Status != ResponseStatus.Success) {
        this.toast.showError(res.Message);
        return;
      }
      this.toast.showSuccess('Supplier account added successfully');
      this.router.navigate(['/supplier-accounts']);
    });
    this.subscriptions.push(sub);
  }
}
