import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPriceticketComponent } from './menu-priceticket.component';

describe('MenuPriceticketComponent', () => {
  let component: MenuPriceticketComponent;
  let fixture: ComponentFixture<MenuPriceticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPriceticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPriceticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
