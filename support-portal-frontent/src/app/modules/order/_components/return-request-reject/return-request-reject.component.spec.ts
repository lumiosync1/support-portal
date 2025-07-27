import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestRejectComponent } from './return-request-reject.component';

describe('ReturnRequestRejectComponent', () => {
  let component: ReturnRequestRejectComponent;
  let fixture: ComponentFixture<ReturnRequestRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnRequestRejectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRequestRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
