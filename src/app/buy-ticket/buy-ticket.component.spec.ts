import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

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
import { PassengerPageComponent } from '../pages/passenger-page/passenger-page.component';
import { of } from 'rxjs';

describe('BuyTicketComponent', () => {
  let component: BuyTicketComponent;
  let fixture: ComponentFixture<BuyTicketComponent>;
  const relativeUrlForBuyTicket: string = 'relativeUrlForBuyTicket';
  const ticketDto1: TicketDto = { name: '1', hasZoneNotLine: false, ticketType: 'onetime', dayInMonthOrMonthInYear: -1 };
  const ticketDto2: TicketDto = { name: '1', hasZoneNotLine: true, ticketType: 'daily', dayInMonthOrMonthInYear: -1 };
  const zone: string = 'neka_zona';
  const ticket: Ticket = {id: 1, ticketType: 'ONETIME', startDateAndTime: 'not yet activated', 
    endDateAndTime: 'not yet activated', lineZone: '1', passengerType: 'STUDENT', price: 200.0};
  const price: number = 2000.0;

  beforeEach(async(() => {
    const genericServiceMock = {
      save: jasmine.createSpy('save')//.arguments(ticketDto1)
        .and.returnValue(of(ticket))
    };

    const successMessage = 'Success message!';
    const errorMessage = 'Error message!';
    const toastrServiceMock = {
      success: jasmine.createSpy('success'), //.arguments = [successMessage],
      error: jasmine.createSpy('error') //.arguments = [errorMessage]
    };

    /*const priceServiceMock = {
      get: jasmine.createSpy('get')//.arguments = [ticketDto1.hasZoneNotLine, ticketDto1.ticketType, zone],
        .and.returnValue(of(price)),
    };*/

    TestBed.configureTestingModule({
      declarations: [ BuyTicketComponent, ModalDialogComponent ],
      imports: [FormsModule, NgbModule, HttpClientModule, ToastrModule.forRoot({ preventDuplicates: true })],
      providers: [
        { provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
        { provide: GenericService, useValue: genericServiceMock }, 
        { provide: ToastrService, useValue: toastrServiceMock }, 
        PriceService // kasnije ce biti mokovan
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.boughtTicketEvent, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('buyTicket test', fakeAsync(() => {
    // component.ngOnInit();
    //fixture.whenStable().then( () => {
    component.ticket = ticketDto1;
    component.buyTicket();

    tick();

    expect(component.boughtTicketEvent.emit).toHaveBeenCalledWith(ticket);
    //});
    //const currentNumOfTickets: number = passengerPageComponent.tickets.length;
    //expect(oldNumOfTickets + 1).toBe(currentNumOfTickets);
  }));

  it('getPrice test', fakeAsync(() => {
    component.ticket = ticketDto1;
    component.selectedZone = {name: 'aaaa', transport: 'bus', lines: []};

    const priceService = TestBed.get(PriceService);
    spyOn(priceService, 'get').and.returnValue(of(price));

    component.getPrice();

    tick();

    expect(priceService.get).toHaveBeenCalledWith(component.ticket.hasZoneNotLine, 
      component.ticket.ticketType, component.selectedZone.name);
    //});
    //const currentNumOfTickets: number = passengerPageComponent.tickets.length;
    //expect(oldNumOfTickets + 1).toBe(currentNumOfTickets);
  }));
});

