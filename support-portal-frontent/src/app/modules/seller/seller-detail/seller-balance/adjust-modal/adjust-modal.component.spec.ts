import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustModalComponent } from './adjust-modal.component';

describe('AdjustModalComponent', () => {
  let component: AdjustModalComponent;
  let fixture: ComponentFixture<AdjustModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
