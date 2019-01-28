import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { ZonePageComponent } from './zone-page.component';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {ZoneComponent} from './zone/zone.component';
import {HttpClientModule} from '@angular/common/http';
import {GenericService} from '../../../services/generic/generic.service';
import {Observable} from 'rxjs';
import {RouterModule} from '@angular/router';
import {Zone} from '../../../model/zone';

describe('ZonePageComponent', () => {
  let component: ZonePageComponent;
  let fixture: ComponentFixture<ZonePageComponent>;
  let genericService: any;

  beforeEach(async(() => {
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
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should get zones", async(() => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      expect(component.zones.length).toBe(3);
    });
  }));

  it("should delete zone", fakeAsync(() => {
    component.ngOnInit();
    expect(genericService.getAll).toHaveBeenCalled();
    fixture.whenStable().then( () => {
      expect(component.zones.length).toBe(3);
      const zoneId: number = 3;
      const zones: Zone[] = [{'id': 1, 'name': 'zone1'}, {'id': 3, 'name': 'zone3'}, {'id': 2, 'name': 'zone2'}];
      component.zones = zones;
      component.delete(zoneId);
      tick();
      expect(genericService.delete).toHaveBeenCalledWith('/zone', zoneId);
    });
  }));

});
