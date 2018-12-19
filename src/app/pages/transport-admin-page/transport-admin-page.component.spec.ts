import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAdminPageComponent } from './transport-admin-page.component';

describe('TransportAdminPageComponent', () => {
  let component: TransportAdminPageComponent;
  let fixture: ComponentFixture<TransportAdminPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportAdminPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
