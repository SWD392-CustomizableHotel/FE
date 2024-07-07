import { TestBed } from '@angular/core/testing';

import { CancelPaymentService } from './cancel-payment.service';

describe('CancelPaymentService', () => {
  let service: CancelPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancelPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
