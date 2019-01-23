import { TestBed } from '@angular/core/testing';

import { ChangeAccountTypeService } from './change-account-type.service';

describe('ChangeAccountTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangeAccountTypeService = TestBed.get(ChangeAccountTypeService);
    expect(service).toBeTruthy();
  });
});
