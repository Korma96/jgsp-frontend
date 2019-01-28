import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PassengerPageComponent } from './passenger-page.component';
import { GenericService } from 'src/app/services/generic/generic.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { Ticket } from 'src/app/model/ticket';
import { ShowTicketsComponent } from 'src/app/show-tickets/show-tickets.component';
import { PositionsOfVehiclesComponent } from 'src/app/positions-of-vehicles/positions-of-vehicles.component';
import { BuyTicketComponent } from 'src/app/buy-ticket/buy-ticket.component';
import { ShowScheduleComponent } from 'src/app/show-schedule/show-schedule.component';
import { ChangeAccountTypeComponent } from 'src/app/change-account-type/change-account-type.component';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { ShowLinesComponent } from 'src/app/show-lines/show-lines.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from 'src/app/modal-dialog/modal-dialog.component';
import { ShowTimesComponent } from 'src/app/show-times/show-times.component';
import { CheckSliderComponent } from 'src/app/check-slider/check-slider.component';
import { CheckDirective } from 'src/app/directives/check.directive';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { DirectionsMapComponent } from 'src/app/directions-map/directions-map.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

describe('PassengerPageComponent', () => {
  let component: PassengerPageComponent;
  let fixture: ComponentFixture<PassengerPageComponent>;

  const ticket: Ticket = {id: 1, ticketType: 'ONETIME', startDateAndTime: 'not yet activated', 
    endDateAndTime: 'not yet activated', lineZone: '1', passengerType: 'STUDENT', price: 200.0};
  const tickets: Ticket[] = [
    { id: 1, price: 200, passengerType: 'STUDENT', lineZone: 'aaa', 
      endDateAndTime: '20.01.2018. 23:59', startDateAndTime: '20.01.2018. 06:00', ticketType: 'onetime'
    },
    { id: 2, price: 30, passengerType: 'PENSIONER', lineZone: 'bbb', 
    endDateAndTime: '25.03.2018. 23:59', startDateAndTime: '25.03.2018. 12:45', ticketType: 'daily'
    }
  ];
  const genericServiceMock = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of(tickets))
  };

  const successMessage = 'Success message!';
  const errorMessage = 'Error message!';
  const toastrServiceMock = {
    success: jasmine.createSpy('success'), //.arguments = [successMessage],
    error: jasmine.createSpy('error') //.arguments = [errorMessage]
  };

  const authenticationServiceMock = {
    getToken: jasmine.createSpy('getToken').and.returnValue('jwt_token'),
    login: jasmine.createSpy('login').and.returnValue(of(true)),
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(
      { username: 'aaa', password: 'aaa',
        roles: ['PASSENGER', 'STUDENT'], token: 'token'}
    )
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule, HttpClientModule, ToastrModule.forRoot({ preventDuplicates: true }),
         FormsModule, ReactiveFormsModule, AgmCoreModule, 
         AgmCoreModule.forRoot({apiKey: 'AIzaSyCncyqJ42IAu6XewfdwvXyVmCOUyr30gWI' })
      ],
      declarations: [ PassengerPageComponent, ShowTicketsComponent, 
        PositionsOfVehiclesComponent, BuyTicketComponent, ShowScheduleComponent, 
        ChangeAccountTypeComponent, ShowLinesComponent, ModalDialogComponent, 
        ShowTimesComponent, CheckSliderComponent, CheckDirective,
        DirectionsMapComponent
      ],
      providers: [
        { provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
        { provide: GenericService, useValue: genericServiceMock }, 
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        GoogleMapsAPIWrapper // kasnije ce biti mokovan
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getTIckets test', fakeAsync(() => {
    const genericService = TestBed.get(GenericService);

    component.getTickets();

    tick();

    expect(genericService.getAll).toHaveBeenCalled();
    expect(component.tickets.length).toBe(2);
  }));

  it('boughtTicket test', fakeAsync(() => {
    const genericService = TestBed.get(GenericService);
    spyOn(component, 'sortTickets');
    const oldNumOfTickets = component.tickets.length;
    
    component.boughtTicket(ticket);

    const currentNumOfTickets = component.tickets.length;

    expect(component.sortTickets).toHaveBeenCalled();
    //expect(component.sortPartOfTickets).toHaveBeenCalledTimes(3);
    expect(oldNumOfTickets + 1).toBe(currentNumOfTickets);
  }));
});
