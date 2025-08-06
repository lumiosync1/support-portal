import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestFinishComponent } from './return-request-finish.component';

describe('ReturnRequestFinishComponent', () => {
  let component: ReturnRequestFinishComponent;
  let fixture: ComponentFixture<ReturnRequestFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnRequestFinishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnRequestFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
