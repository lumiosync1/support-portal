import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnOrderModalComponent } from './return-order-modal.component';

describe('ReturnOrderModalComponent', () => {
  let component: ReturnOrderModalComponent;
  let fixture: ComponentFixture<ReturnOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnOrderModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
