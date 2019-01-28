import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAdminMapComponent } from './transport-admin-map.component';
import {Observable} from 'rxjs';
import {AddZoneComponent} from '../zone-page/add-zone/add-zone.component';
import {Router, RouterModule} from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {GenericService} from '../../../services/generic/generic.service';
import {GoogleMapsAPIWrapper} from '@agm/core';
import {StopService} from '../../../services/transport-admin-services/stop-service/stop.service';

describe('TransportAdminMapComponent', () => {
  let component: TransportAdminMapComponent;
  let fixture: ComponentFixture<TransportAdminMapComponent>;
  let stopService: any;
  let toastr: any;
  let googleMapsApi: any;

  beforeEach(async(() => {
    let stopServiceMock = {
      getAll: jasmine.createSpy('getAll')
        .and.returnValue(Observable.of([{'name':'stop1'}, {'name':'stop2'}, {'name':'stop3'}])),
    };

    let toastrMock = {
      warning: jasmine.createSpy('warning'),
      success: jasmine.createSpy('success')
    };

    let googleMapsApiMock = {
      getNativeMap: jasmine.createSpy('getNativeMap')
        .and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      declarations: [ TransportAdminMapComponent ],
      imports: [ToastrModule.forRoot() , HttpClientModule, FormsModule],
      providers: [{ provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
        { provide: ToastrService, useValue: toastrMock },
        { provide: StopService, useValue: stopServiceMock},
        { provide: GoogleMapsAPIWrapper, useValue: googleMapsApiMock}]
    }).compileComponents();

    fixture = TestBed.createComponent(TransportAdminMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stopService = TestBed.get(StopService);
    toastr = TestBed.get(ToastrService);
    googleMapsApi = TestBed.get(GoogleMapsAPIWrapper);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
