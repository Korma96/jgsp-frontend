import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSliderComponent } from './check-slider.component';

describe('CheckSliderComponent', () => {
  let component: CheckSliderComponent;
  let fixture: ComponentFixture<CheckSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
