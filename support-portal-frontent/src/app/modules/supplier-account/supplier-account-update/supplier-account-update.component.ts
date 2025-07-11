import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/_metronic/layout';
import { ToastService } from '../../shared/services/toast.service';
import { Router } from '@angular/router';
import { SupplierAccountService } from '../supplier-account.service';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize } from 'rxjs/operators';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SupplierAccountUpdateInitDataDto } from '../_models/SupplierAccountUpdateInitDataDto';
import { ActivatedRoute } from '@angular/router';
import { SupplierAccountUpdateDto } from '../_models/SupplierAccountUpdateDto';
import { SupplierAccountUpdateForm } from '../_models/SupplierAccountUpdateFrom';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-supplier-account-update',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './supplier-account-update.component.html',
  styleUrl: './supplier-account-update.component.scss'
})
export class SupplierAccountUpdateComponent {
  private subscriptions: Subscription[] = [];
  private fb = inject(FormBuilder);
  private page = inject(PageInfoService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private supplierAccountService = inject(SupplierAccountService);
  private loadingService = inject(LoadingService);

  id: number;
  initData: SupplierAccountUpdateInitDataDto;
  account: SupplierAccountUpdateForm;
  formGroup: FormGroup;

  ngOnInit(): void {
    this.page.updateTitle('Update Supplier Account');
    this.id = this.route.snapshot.params['id'];
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  loadData() {
    const sub = this.supplierAccountService.initDataUpdate(this.id)
    .pipe(
      finalize(() => this.loadingService.hideLoading())
    )
    .subscribe(res => {
      if(res.Status != ResponseStatus.Success) {
        this.toast.showError(res.Message);
        return;
      }

      const setttings = JSON.parse(res.Data.SupplierAccount.protection_settings??'{"MaxOrders1Hour": 0, "MaxOrders24Hour": 0}');
      this.account = {
        account_id: res.Data.SupplierAccount.account_id,
        account_name: res.Data.SupplierAccount.account_name,
        account_password: res.Data.SupplierAccount.account_password,
        ml_profile: res.Data.SupplierAccount.ml_profile,
        supplier: res.Data.SupplierAccount.supplier,
        site: res.Data.SupplierAccount.site,
        allow_purchase: res.Data.SupplierAccount.allow_purchase,
        enabled: res.Data.SupplierAccount.enabled,
        note: res.Data.SupplierAccount.note,
        max_orders_1h: setttings.MaxOrders1Hour,
        max_orders_2h: setttings.MaxOrders2Hour,
        max_orders_4h: setttings.MaxOrders4Hour,
        max_orders_12h: setttings.MaxOrders12Hour,
        max_orders_24h: setttings.MaxOrders24Hour,
      };

      this.createForm();
    });
    this.subscriptions.push(sub);
  }

  createForm() {
    this.formGroup = this.fb.group({
      account_name: [this.account.account_name, [Validators.required]],
      account_password: [this.account.account_password, [Validators.required]],
      ml_profile: [this.account.ml_profile, [Validators.required]],
      supplier: [this.account.supplier, [Validators.required]],
      site: [this.account.site, [Validators.required]],
      max_orders_1h: [this.account.max_orders_1h],
      max_orders_2h: [this.account.max_orders_2h],
      max_orders_4h: [this.account.max_orders_4h],
      max_orders_12h: [this.account.max_orders_12h],
      max_orders_24h: [this.account.max_orders_24h, Validators.required],
      allow_purchase: [this.account.allow_purchase, [Validators.required]],
      enabled: [this.account.enabled, [Validators.required]],
      note: [this.account.note],
    })
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      this.toast.showError('Please fill in all required fields');
      return;
    }
    
    const formValue = this.formGroup.value;
    const dto: SupplierAccountUpdateDto = {
      account_name: formValue.account_name,
      account_password: formValue.account_password,
      ml_profile: formValue.ml_profile,
      supplier: formValue.supplier,
      site: formValue.site,
      protection_settings: JSON.stringify({
        MaxOrders1Hour: formValue.max_orders_1h,
        MaxOrders2Hour: formValue.max_orders_2h,
        MaxOrders4Hour: formValue.max_orders_4h,
        MaxOrders12Hour: formValue.max_orders_12h,
        MaxOrders24Hour: formValue.max_orders_24h
      }),
      allow_purchase: formValue.allow_purchase,
      enabled: formValue.enabled,
      note: formValue.note,
      account_id: this.id,
    };

    this.loadingService.showLoading();
    
    const sub = this.supplierAccountService.update(dto)
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
