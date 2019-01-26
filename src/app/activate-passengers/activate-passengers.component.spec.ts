import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatePassengersComponent } from './activate-passengers.component';

describe('ActivatePassengersComponent', () => {
  let component: ActivatePassengersComponent;
  let fixture: ComponentFixture<ActivatePassengersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatePassengersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivatePassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
