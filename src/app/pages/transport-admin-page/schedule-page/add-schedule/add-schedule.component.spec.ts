import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScheduleComponent } from './add-schedule.component';
import {Observable} from 'rxjs';
import {AddZoneComponent} from '../../zone-page/add-zone/add-zone.component';
import {ActivatedRoute, Params, Router, RouterModule} from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {GenericService} from '../../../../services/generic/generic.service';
import {ScheduleService} from '../../../../services/schedule/schedule.service';
import {TimetableComponent} from '../timetable/timetable.component';
import {AddTimeComponent} from '../add-time/add-time.component';
import {TimeComponent} from '../time/time.component';

describe('AddScheduleComponent', () => {
  let component: AddScheduleComponent;
  let fixture: ComponentFixture<AddScheduleComponent>;
  let genericService: any;
  let router: any;
  let toastr: any;
  let scheduleService: any;

  beforeEach(async(() => {
    let genericServiceMock = {
      getAll: jasmine.createSpy('getAll')
        .and.returnValue(Observable.of([{'id': 1, 'name':'1A'}, {'id': 2, 'name':'1B'}, {'id': 1, 'name':'1A'}, {'id': 2, 'name':'1B'}])),
      post: jasmine.createSpy('post')
        .and.returnValue(Observable.of({}))
    };

    let scheduleServiceMock = {};

    let routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    let toastrMock = {
      warning: jasmine.createSpy('warning'),
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    TestBed.configureTestingModule({
      declarations: [ AddScheduleComponent, TimetableComponent, AddTimeComponent, TimeComponent ],
      imports: [RouterModule.forRoot([]), ToastrModule.forRoot() , HttpClientModule, FormsModule],
      providers: [{ provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
        { provide: ToastrService, useValue: toastrMock },
        { provide: GenericService, useValue: genericServiceMock},
        { provide: ScheduleService, useValue: scheduleServiceMock},
        { provide: Router, useValue: routerMock},
        { provide: ActivatedRoute, useValue: {'params': Observable.from([{ 'name': '1' }])} }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    genericService = TestBed.get(GenericService);
    router = TestBed.get(Router);
    toastr = TestBed.get(ToastrService);
    scheduleService = TestBed.get(ScheduleService);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find complete line', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      expect(component.completeLine.aLineId).toBe(1);
      expect(component.completeLine.bLineId).toBe(2);
    });
  });

  it('should prevent continue due to empty date from', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      component.chosenDate = "";
      const res: boolean = component.canContinue();
      expect(res).toBe(false);
      expect(toastr.warning).toHaveBeenCalledWith('Valid from can`t be empty!');
    });
  });

  it('should prevent continue because date from already exists', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      component.chosenDate = "2019-12-03";
      component.allLineDatesFrom = ["2019-11-05", "2019-12-03"];
      const res: boolean = component.canContinue();
      expect(res).toBe(false);
      expect(toastr.warning).toHaveBeenCalledWith('Schedule valid from date \nfor line already exists!');
    });
  });

  it('should prevent continue because direction a does not contain any time', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      component.chosenDate = "2019-12-11";
      component.allLineDatesFrom = ["2019-11-05", "2019-12-03"];
      component.lineWithTimes = {'lineName': '1', 'timesA': [], 'timesB': ["11:21", "13:43"]};
      const res: boolean = component.canContinue();
      expect(res).toBe(false);
      expect(toastr.warning).toHaveBeenCalledWith('Direction A must have at least one time!');
    });
  });

  it('should prevent continue because direction b does not contain any time', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      component.chosenDate = "2019-12-11";
      component.allLineDatesFrom = ["2019-11-05", "2019-12-03"];
      component.lineWithTimes = {'lineName': '1', 'timesA': ["11:21", "13:43"], 'timesB': []};
      const res: boolean = component.canContinue();
      expect(res).toBe(false);
      expect(toastr.warning).toHaveBeenCalledWith('Direction B must have at least one time!');
    });
  });

  it('should continue', () => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      component.chosenDate = "2019-12-11";
      component.allLineDatesFrom = ["2019-11-05", "2019-12-03"];
      component.lineWithTimes = {'lineName': '1', 'timesA': ["11:21", "13:43"], 'timesB': ["11:22", "12:23"]};
      const res: boolean = component.canContinue();
      expect(res).toBe(true);
    });
  });
});
