import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ZonePageComponent } from './zone-page.component';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {ZoneComponent} from './zone/zone.component';
import {HttpClientModule} from '@angular/common/http';
import {GenericService} from '../../../services/generic/generic.service';
import {Observable} from 'rxjs';
import {RouterModule} from '@angular/router';

describe('ZonePageComponent', () => {
  let component: ZonePageComponent;
  let fixture: ComponentFixture<ZonePageComponent>;
  let genericService: any;

  beforeEach(() => {
    let genericServiceMock = {
      getAll: jasmine.createSpy('getAll')
        .and.returnValue(Observable.of([{}, {}, {}])),
      delete: jasmine.createSpy('delete')
        .and.returnValue(Observable.of())
    };

    TestBed.configureTestingModule({
      declarations: [ ZonePageComponent, ZoneComponent ],
      imports: [RouterModule.forRoot([]), ToastrModule.forRoot() , HttpClientModule],
      providers: [{ provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },
                  { provide: ToastrService },
                  { provide: GenericService, useValue: genericServiceMock}]
    }).compileComponents();

    fixture = TestBed.createComponent(ZonePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    genericService = TestBed.get(GenericService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should call getUsers and return list of users", async(() => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      expect(component.zones.length).toBe(3);
    });
  }));
});
