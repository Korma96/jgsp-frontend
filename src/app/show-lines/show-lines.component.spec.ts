import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLinesComponent } from './show-lines.component';

describe('ShowLinesComponent', () => {
  let component: ShowLinesComponent;
  let fixture: ComponentFixture<ShowLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
