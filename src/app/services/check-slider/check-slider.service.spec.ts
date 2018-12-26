import { TestBed } from '@angular/core/testing';

import { CheckSliderService } from './check-slider.service';

describe('CheckSliderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckSliderService = TestBed.get(CheckSliderService);
    expect(service).toBeTruthy();
  });
});
