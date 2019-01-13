import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsOfVehiclesComponent } from './positions-of-vehicles.component';

describe('PositionsOfVehiclesComponent', () => {
  let component: PositionsOfVehiclesComponent;
  let fixture: ComponentFixture<PositionsOfVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionsOfVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionsOfVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
