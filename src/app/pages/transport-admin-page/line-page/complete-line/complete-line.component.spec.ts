import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteLineComponent } from './complete-line.component';

describe('CompleteLineComponent', () => {
  let component: CompleteLineComponent;
  let fixture: ComponentFixture<CompleteLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
