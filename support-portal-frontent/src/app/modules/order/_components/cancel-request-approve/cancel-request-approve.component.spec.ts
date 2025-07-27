import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRequestApproveComponent } from './cancel-request-approve.component';

describe('CancelRequestApproveComponent', () => {
  let component: CancelRequestApproveComponent;
  let fixture: ComponentFixture<CancelRequestApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelRequestApproveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelRequestApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
