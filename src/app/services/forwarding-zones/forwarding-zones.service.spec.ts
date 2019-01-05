import { TestBed } from '@angular/core/testing';

import { ForwardingZonesService } from './forwarding-zones.service';

describe('ForwardingZonesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForwardingZonesService = TestBed.get(ForwardingZonesService);
    expect(service).toBeTruthy();
  });
});
