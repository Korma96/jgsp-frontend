import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateZoneComponent } from './update-zone.component';
import {Observable} from 'rxjs';
import {AddZoneComponent} from '../add-zone/add-zone.component';
import {Router, RouterModule} from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {GenericService} from '../../../../services/generic/generic.service';
import {CompleteLineComponent} from '../../line-page/complete-line/complete-line.component';

describe('UpdateZoneComponent', () => {
  let component: UpdateZoneComponent;
  let fixture: ComponentFixture<UpdateZoneComponent>;
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
      declarations: [ UpdateZoneComponent, CompleteLineComponent ],
      imports: [RouterModule.forRoot([]), ToastrModule.forRoot() , HttpClientModule, FormsModule],
      providers: [{ provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
        { provide: ToastrService, useValue: toastrMock },
        { provide: GenericService, useValue: genericServiceMock},
        { provide: Router, useValue: routerMock}]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    genericService = TestBed.get(GenericService);
    router = TestBed.get(Router);
    toastr = TestBed.get(ToastrService);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
