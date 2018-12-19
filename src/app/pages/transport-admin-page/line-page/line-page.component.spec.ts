import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinePageComponent } from './line-page.component';

describe('LinePageComponent', () => {
  let component: LinePageComponent;
  let fixture: ComponentFixture<LinePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
