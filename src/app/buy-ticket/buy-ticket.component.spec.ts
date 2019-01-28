import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTicketComponent } from './buy-ticket.component';
import { FormsModule } from '@angular/forms';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { NgbModule, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { PriceService } from '../services/price/price.service';
import { TicketDto } from '../model/ticket-dto';
import { Ticket } from '../model/ticket';
/*
describe('BuyTicketComponent', () => {
  let component: BuyTicketComponent;
  let fixture: ComponentFixture<BuyTicketComponent>;
  const relativeUrlForBuyTicket: string = 'relativeUrlForBuyTicket';
  const ticketDto: TicketDto = { name: '1', hasZoneNotLine: false, ticketType: 'onetime', dayInMonthOrMonthInYear: -1 };
  const ticket: Ticket = {startDateAndTime: 'not yet activated', endDateAndTime: 'not yet activated'}
  beforeEach(async(() => {
    const genericServiceMock = {
      save: jasmine.createSpy('save').arguments(ticketDto)
        .and.returnValue(Promise.resolve(new Student({
            startDateAndTime: 1,
            cardNumber: 'a123',
            firstName: 'Petar',
            lastName: 'Petrovic'            
         	}))),
    };

    TestBed.configureTestingModule({
      declarations: [ BuyTicketComponent, ModalDialogComponent ],
      imports: [FormsModule, NgbModule, HttpClientModule, ToastrModule.forRoot({ preventDuplicates: true })],
      providers: [
        { provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
        { provide: GenericService, useValue: genericServiceMock }, 
        { provide: ToastrService, useValue: toastrServiceMock }, 
        { provide: PriceService, useValue: priceServiceMock }, 
        { provide: NgbCalendar, useValue: ngbCalendarMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
