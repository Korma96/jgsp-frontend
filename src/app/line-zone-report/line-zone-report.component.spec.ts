import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineZoneReportComponent } from './line-zone-report.component';

describe('LineZoneReportComponent', () => {
  let component: LineZoneReportComponent;
  let fixture: ComponentFixture<LineZoneReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineZoneReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineZoneReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
