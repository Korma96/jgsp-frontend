import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRequestsComponent } from './account-requests.component';

describe('AccountRequestsComponent', () => {
  let component: AccountRequestsComponent;
  let fixture: ComponentFixture<AccountRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
