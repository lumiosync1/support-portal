import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAccountUpdateComponent } from './supplier-account-update.component';

describe('SupplierAccountUpdateComponent', () => {
  let component: SupplierAccountUpdateComponent;
  let fixture: ComponentFixture<SupplierAccountUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierAccountUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAccountUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
