import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { GenericService } from './services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { ForwardingZonesService } from './services/forwarding-zones/forwarding-zones.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    /*let lineServiceMock = {
      setDistinctLines: jasmine.createSpy('setDistinctLines').arguments().and.returnValue(Promise.resolve([
          {name: 'zona1'}
        ])),

      getStudentEnrollments: jasmine.createSpy('getStudentEnrollments')
        .and.returnValue(Promise.resolve([
          {
            id: 1,
            startDate: Date.UTC(2016, 0, 1),
            endDate: Date.UTC(2017, 0, 1),
            student: {
                id: 1,
                cardNumber: 'a123',
                firstName: 'Petar',
                lastName: 'Petrovic'            
            }, 
            course: {
              id: 7,
              name: 'Matematika'
            }
          },
          {
            id: 2,
            startDate: Date.UTC(2015, 0, 1),
            endDate: Date.UTC(2016, 0, 1),
            student: {
                id: 1,
                cardNumber: 'a123',
                firstName: 'Petar',
                lastName: 'Petrovic'           
            }, 
            course: {
              id: 8,
              name: 'Programiranje'
            }
          }])),
      addStudent: jasmine.createSpy('addStudent')
          .and.returnValue(Promise.resolve()),
      editStudent: jasmine.createSpy('editStudent')
          .and.returnValue(Promise.resolve()),
      announceChange: jasmine.createSpy('announceChange') 
    };*/


    TestBed.configureTestingModule({
      declarations: [
        AppComponent, NavBarComponent
      ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [ 
        GenericService, ToastrService, ForwardingZonesService, 
        { provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  /*it(`should have as title 'jgsp-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('jgsp-frontend');
  });*/

  /*it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to jgsp-frontend!');
  });*/
});
