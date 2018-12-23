import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsMapComponent } from './directions-map.component';

describe('DirectionsMapComponent', () => {
  let component: DirectionsMapComponent;
  let fixture: ComponentFixture<DirectionsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectionsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
