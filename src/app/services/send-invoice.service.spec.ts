import { TestBed } from '@angular/core/testing';

import { SendInvoiceService } from './send-invoice.service';

describe('SendInvoiceService', () => {
  let service: SendInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
