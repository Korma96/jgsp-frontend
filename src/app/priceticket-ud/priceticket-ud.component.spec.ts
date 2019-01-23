import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceticketUdComponent } from './priceticket-ud.component';

describe('PriceticketUdComponent', () => {
  let component: PriceticketUdComponent;
  let fixture: ComponentFixture<PriceticketUdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceticketUdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceticketUdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
