import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTimesComponent } from './show-times.component';

describe('ShowTimesComponent', () => {
  let component: ShowTimesComponent;
  let fixture: ComponentFixture<ShowTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
