import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAccountTypeComponent } from './change-account-type.component';

describe('ChangeAccountTypeComponent', () => {
  let component: ChangeAccountTypeComponent;
  let fixture: ComponentFixture<ChangeAccountTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAccountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
