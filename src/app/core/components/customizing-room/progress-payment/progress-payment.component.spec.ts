import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressPaymentComponent } from './progress-payment.component';

describe('ProgressPaymentComponent', () => {
  let component: ProgressPaymentComponent;
  let fixture: ComponentFixture<ProgressPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
