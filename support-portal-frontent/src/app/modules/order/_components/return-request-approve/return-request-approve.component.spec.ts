import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestApproveComponent } from './return-request-approve.component';

describe('ReturnRequestApproveComponent', () => {
  let component: ReturnRequestApproveComponent;
  let fixture: ComponentFixture<ReturnRequestApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnRequestApproveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRequestApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
