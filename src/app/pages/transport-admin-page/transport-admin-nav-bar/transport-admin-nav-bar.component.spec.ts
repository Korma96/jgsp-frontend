import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAdminNavBarComponent } from './transport-admin-nav-bar.component';

describe('TransportAdminNavBarComponent', () => {
  let component: TransportAdminNavBarComponent;
  let fixture: ComponentFixture<TransportAdminNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportAdminNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportAdminNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
