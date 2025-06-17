import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAccountListComponent } from './supplier-account-list.component';

describe('SupplierAccountListComponent', () => {
  let component: SupplierAccountListComponent;
  let fixture: ComponentFixture<SupplierAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierAccountListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
