import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAccountQueueComponent } from './supplier-account-queue.component';

describe('SupplierAccountQueueComponent', () => {
  let component: SupplierAccountQueueComponent;
  let fixture: ComponentFixture<SupplierAccountQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierAccountQueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAccountQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
