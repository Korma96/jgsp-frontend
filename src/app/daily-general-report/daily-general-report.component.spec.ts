import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyGeneralReportComponent } from './daily-general-report.component';

describe('DailyGeneralReportComponent', () => {
  let component: DailyGeneralReportComponent;
  let fixture: ComponentFixture<DailyGeneralReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyGeneralReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyGeneralReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
