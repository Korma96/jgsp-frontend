import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPriceTicketComponent } from './add-price-ticket.component';

describe('AddPriceTicketComponent', () => {
  let component: AddPriceTicketComponent;
  let fixture: ComponentFixture<AddPriceTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPriceTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPriceTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
