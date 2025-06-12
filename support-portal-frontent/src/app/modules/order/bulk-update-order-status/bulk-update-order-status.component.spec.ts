import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUpdateOrderStatusComponent } from './bulk-update-order-status.component';

describe('BulkUpdateOrderStatusComponent', () => {
  let component: BulkUpdateOrderStatusComponent;
  let fixture: ComponentFixture<BulkUpdateOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkUpdateOrderStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkUpdateOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
