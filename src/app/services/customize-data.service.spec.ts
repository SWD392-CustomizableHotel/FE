import { TestBed } from '@angular/core/testing';

import { CustomizeDataService } from './customize-data.service';

describe('CustomizeDataService', () => {
  let service: CustomizeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomizeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
