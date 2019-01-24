import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAdminLineMapComponent } from './transport-admin-line-map.component';

describe('TransportAdminLineMapComponent', () => {
  let component: TransportAdminLineMapComponent;
  let fixture: ComponentFixture<TransportAdminLineMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportAdminLineMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportAdminLineMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
