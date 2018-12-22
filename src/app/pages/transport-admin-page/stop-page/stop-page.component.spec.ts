import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPageComponent } from './stop-page.component';

describe('StopPageComponent', () => {
  let component: StopPageComponent;
  let fixture: ComponentFixture<StopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
