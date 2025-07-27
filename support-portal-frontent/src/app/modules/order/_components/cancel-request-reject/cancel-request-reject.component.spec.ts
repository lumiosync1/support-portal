import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRequestRejectComponent } from './cancel-request-reject.component';

describe('CancelRequestRejectComponent', () => {
  let component: CancelRequestRejectComponent;
  let fixture: ComponentFixture<CancelRequestRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelRequestRejectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelRequestRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
