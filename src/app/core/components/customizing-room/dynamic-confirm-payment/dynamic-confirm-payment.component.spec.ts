import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicConfirmPaymentComponent } from './dynamic-confirm-payment.component';

describe('DynamicConfirmPaymentComponent', () => {
  let component: DynamicConfirmPaymentComponent;
  let fixture: ComponentFixture<DynamicConfirmPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicConfirmPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicConfirmPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
