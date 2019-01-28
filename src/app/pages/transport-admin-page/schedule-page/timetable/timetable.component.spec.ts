import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableComponent } from './timetable.component';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AddTimeComponent} from '../add-time/add-time.component';
import {TimeComponent} from '../time/time.component';
import {ScheduleService} from '../../../../services/schedule/schedule.service';

describe('TimetableComponent', () => {
  let component: TimetableComponent;
  let fixture: ComponentFixture<TimetableComponent>;
  let scheduleService: any;
  let toastr: any;

  beforeEach(async(() => {

    let scheduleServiceMock = {};

    let toastrMock = {
      warning: jasmine.createSpy('warning'),
      success: jasmine.createSpy('success')
    };

    TestBed.configureTestingModule({
      declarations: [ TimetableComponent, AddTimeComponent, TimeComponent ],
      imports: [ToastrModule.forRoot() , HttpClientModule, FormsModule],
      providers: [{ provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
        { provide: ToastrService, useValue: toastrMock },
        { provide: ScheduleService, useValue: scheduleServiceMock}]
    }).compileComponents();

    fixture = TestBed.createComponent(TimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    scheduleService = TestBed.get(ScheduleService);
    toastr = TestBed.get(ToastrService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent adding time to direction a due to empty time', () => {
    component.ngOnInit();
    fixture.whenStable().then( () => {
      component.addTimeToA("");
      expect(toastr.warning).toHaveBeenCalledWith('Time can`t be empty!');
    });
  });

  it('should prevent adding time to direction a because time already exists', () => {
    component.ngOnInit();
    fixture.whenStable().then( () => {
      component.lineWithTimes = {'lineName': '1', 'timesA': ["11:21", "13:43"], 'timesB': []};
      component.addTimeToA("11:21");
      expect(toastr.warning).toHaveBeenCalledWith('Time already exists!');
    });
  });

  it('should add time to direction a', () => {
    component.ngOnInit();
    fixture.whenStable().then( () => {
      component.lineWithTimes = {'lineName': '1', 'timesA': ["11:21", "13:43"], 'timesB': []};
      component.contactServer = false;
      component.addTimeToA("12:22");
      expect(component.lineWithTimes.timesA.length).toBe(3);
      expect(component.lineWithTimes.timesA[0]).toBe("11:21");
      expect(component.lineWithTimes.timesA[1]).toBe("12:22");
      expect(component.lineWithTimes.timesA[2]).toBe("13:43");
    });
  });

  it('should remove time from direction a', () => {
    component.ngOnInit();
    fixture.whenStable().then( () => {
      component.lineWithTimes = {'lineName': '1', 'timesA': ["11:21", "13:43"], 'timesB': []};
      component.contactServer = false;
      component.addTimeToA("12:22");
      expect(component.lineWithTimes.timesA.length).toBe(3);
      expect(component.lineWithTimes.timesA[0]).toBe("11:21");
      expect(component.lineWithTimes.timesA[1]).toBe("12:22");
      expect(component.lineWithTimes.timesA[2]).toBe("13:43");
    });
  });

});
