import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAccountAddComponent } from './supplier-account-add.component';

describe('SupplierAccountAddComponent', () => {
  let component: SupplierAccountAddComponent;
  let fixture: ComponentFixture<SupplierAccountAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierAccountAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAccountAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
