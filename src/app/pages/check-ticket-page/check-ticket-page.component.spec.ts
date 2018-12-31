import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTicketPageComponent } from './check-ticket-page.component';

describe('CheckTicketPageComponent', () => {
  let component: CheckTicketPageComponent;
  let fixture: ComponentFixture<CheckTicketPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckTicketPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckTicketPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
