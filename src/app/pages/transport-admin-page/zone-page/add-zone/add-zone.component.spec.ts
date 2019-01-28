import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { AddZoneComponent } from './add-zone.component';
import {Observable} from 'rxjs';
import {ZonePageComponent} from '../zone-page.component';
import {ZoneComponent} from '../zone/zone.component';
import {Router, RouterModule} from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {GenericService} from '../../../../services/generic/generic.service';
import {FormsModule} from '@angular/forms';

describe('AddZoneComponent', () => {
  let component: AddZoneComponent;
  let fixture: ComponentFixture<AddZoneComponent>;
  let genericService: any;
  let router: any;
  let toastr: any;

  beforeEach(async(() => {
    let genericServiceMock = {
      getAll: jasmine.createSpy('getAll')
        .and.returnValue(Observable.of([{'name':'zone1'}, {'name':'zone2'}, {'name':'zone3'}])),
      post: jasmine.createSpy('post')
        .and.returnValue(Observable.of({}))
    };

    let routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    let toastrMock = {
      warning: jasmine.createSpy('warning'),
      success: jasmine.createSpy('success')
    };

    TestBed.configureTestingModule({
      declarations: [ AddZoneComponent ],
      imports: [RouterModule.forRoot([]), ToastrModule.forRoot() , HttpClientModule, FormsModule],
      providers: [{ provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
        { provide: ToastrService, useValue: toastrMock },
        { provide: GenericService, useValue: genericServiceMock},
        { provide: Router, useValue: routerMock}]
    }).compileComponents();

    fixture = TestBed.createComponent(AddZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    genericService = TestBed.get(GenericService);
    router = TestBed.get(Router);
    toastr = TestBed.get(ToastrService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate allZonesNames', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      expect(component.allZonesNames.length).toBe(3);
    });
  });

  it('should stop saving due to empty zone name', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      expect(component.allZonesNames.length).toBe(3);
      component.zone = {'id': NaN, 'name': ' '};
      component.save();
      expect(toastr.warning).toHaveBeenCalledWith('Zone name can`t be empty or whitespace!');
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });
  });

  it('should stop saving due to invalid zone name', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      expect(component.allZonesNames.length).toBe(3);
      component.zone = {'id': NaN, 'name': 'zone1'};
      component.save();
      expect(toastr.warning).toHaveBeenCalledWith(`Zone with name zone1 already exists!`);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });
  });

  it('should zone saved successfully', fakeAsync(() => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      expect(component.allZonesNames.length).toBe(3);
      component.zone = {'id': NaN, 'name': 'zone'};
      component.save();
      tick();
      expect(genericService.post).toHaveBeenCalledTimes(1);
    });
  }));

});
