import { TestBed } from '@angular/core/testing';

import { GenericService } from './generic.service';
import { Line } from 'src/app/model/line';

describe('GenericService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericService = TestBed.get(GenericService);
    expect(service).toBeTruthy();
  });
});
