import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBalanceComponent } from './seller-balance.component';

describe('SellerBalanceComponent', () => {
  let component: SellerBalanceComponent;
  let fixture: ComponentFixture<SellerBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
