import { TestBed, inject } from '@angular/core/testing';
import { CanActivateUserGuard } from './can-activate-user.guard';


describe('CanActivatePassengerGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [CanActivateUserGuard]
  }));

  it('should be created', inject([CanActivateUserGuard], (guard: CanActivateUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
