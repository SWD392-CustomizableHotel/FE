import { TestBed } from '@angular/core/testing';

import { CustomizingRoomService } from './customizing-room.service';

describe('CustomizingRoomService', () => {
  let service: CustomizingRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomizingRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
