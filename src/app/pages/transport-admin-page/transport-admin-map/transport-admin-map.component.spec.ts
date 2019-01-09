import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAdminMapComponent } from './transport-admin-map.component';

describe('TransportAdminMapComponent', () => {
  let component: TransportAdminMapComponent;
  let fixture: ComponentFixture<TransportAdminMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportAdminMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportAdminMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
