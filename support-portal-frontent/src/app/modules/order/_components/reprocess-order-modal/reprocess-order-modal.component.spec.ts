import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocessOrderModalComponent } from './reprocess-order-modal.component';

describe('ReprocessOrderModalComponent', () => {
  let component: ReprocessOrderModalComponent;
  let fixture: ComponentFixture<ReprocessOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReprocessOrderModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprocessOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
