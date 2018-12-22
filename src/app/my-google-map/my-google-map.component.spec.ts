import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGoogleMapComponent } from './my-google-map.component';

describe('MyGoogleMapComponent', () => {
  let component: MyGoogleMapComponent;
  let fixture: ComponentFixture<MyGoogleMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGoogleMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
