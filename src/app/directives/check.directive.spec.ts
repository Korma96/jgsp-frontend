import { CheckDirective } from './check.directive';

describe('CheckDirective', () => {
  it('should create an instance', () => {
    const elRefMock = {
      nativeElement: document.createElement('input')
    };
    
    const directive = new CheckDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
