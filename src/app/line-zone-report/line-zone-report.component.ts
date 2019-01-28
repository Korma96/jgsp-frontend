import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { Report } from '../model/report';
import { ZoneWithLines } from '../model/zone-with-lines';
import { ReportService } from '../services/report.service';
import { ToastrService } from 'ngx-toastr';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ForwardingZonesService } from '../services/forwarding-zones/forwarding-zones.service';
import { Line } from '../model/line';

@Component({
  selector: 'app-line-zone-report',
  templateUrl: './line-zone-report.component.html',
  styleUrls: ['./line-zone-report.component.css']
})
export class LineZoneReportComponent implements OnInit, OnChanges {
  
  @Input()
  zones: ZoneWithLines[];

  transports: string[] = ['bus', 'tram', 'metro'];
  transport: number;
  selectedZone: ZoneWithLines;

  date1: any;
  date2: any;
  reports: Report[];
  relativeUrlGeneral: string;
  relativeUrlDaily: string;
  lines: Line[];
  lineName: string;

  constructor(private reportService: ReportService, private toastr: ToastrService, 
              private ngbDateParserFormatter: NgbDateParserFormatter,
              private forwardingZonesService: ForwardingZonesService) {
    this.relativeUrlGeneral = '/userAdmin/line-zone-report';
    this.relativeUrlDaily = '/userAdmin/line-zone-daily-report';
    this.reports = [];
    this.transport = 0;
    this.selectedZone = null;
   }

  ngOnInit() {
    this.forwardingZonesService.replaySubject.subscribe(
      (receivedZones: ZoneWithLines[]) => this.zones = receivedZones
    );

    if (this.zones) {
      if (this.zones.length > 0) {
        const filteredZones = this.zones.filter(z => z.transport === this.transports[this.transport]);
        if (filteredZones.length > 0) {
          this.selectedZone = filteredZones[0];
        }
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    const zones: SimpleChange = changes.zones;
    
    if (!zones.firstChange) {
      if (zones.currentValue.length > 0) {
        const filteredZones = zones.currentValue.filter(z => z.transport === this.transports[this.transport]);
        if (filteredZones.length > 0) {
          this.selectedZone = filteredZones[0];
        }
      }
    }
  }
  transportChanged() {
    const filteredZones = this.zones.filter(zone => zone.transport === this.transports[this.transport]);
    if (filteredZones.length > 0) {
      this.selectedZone = filteredZones[0];
    }
    this.lines = [];
  }
  selectedZoneChanged() {
    this.lines = [];
  }

  showReports() {
    if (this.date1 === undefined || this.date2 === undefined) {
      this.toastr.error('You have to pick start and end date!');
    }
    else {
      if (this.validDates(this.date1, this.date2)) {
        if (this.lineName !== undefined) {
          const date1Str = this.date1.year + '-' + this.date1.month + '-' + this.date1.day;
          const date2Str = this.date2.year + '-' + this.date2.month + '-' + this.date2.day;
          const date1StrFront = this.ngbDateParserFormatter.format(this.date1);
          const date2StrFront = this.ngbDateParserFormatter.format(this.date2);
          if (date1Str === date2Str) {
            this.reportService.getDailyLineZoneReport<Report>(this.relativeUrlDaily, this.lineName, date1Str).subscribe(
              (report: Report) => {
                report.date = date1StrFront;
                report.lineName = this.lineName;

                if (!this.exists(report)) {
                  this.reports.push(report);
                }
                else {
                  this.toastr.error('Report already exists!');
                }
                if (this.reports.length > 10) {
                  this.reports.splice(0, 1);
                }
                if (!this.reports) {
                  this.toastr.error('Problem with loading of report!');
                }
              },
              error => console.log('Error: ' + JSON.stringify(error))
            );
          }
          else {
            this.reportService.getLineZoneReport<Report>(this.relativeUrlGeneral, this.lineName, date1Str, date2Str).subscribe(
              (report: Report) => {

                report.date = date1StrFront + ' - ' + date2StrFront;
                report.lineName = this.lineName;

                if (!this.exists(report)) {
                  this.reports.push(report);
                }
                else {
                  this.toastr.error('Report already exists!');
                }
                if (this.reports.length > 10) {
                  this.reports.splice(0, 1);
                }
                if (!this.reports) {
                  this.toastr.error('Problem with loading of report!');
                }
              },
              error => console.log('Error: ' + JSON.stringify(error))
            );
          }
      }
      else {
        this.toastr.error('You have to select a line!');
      }
    }
    
      else {
        this.toastr.error('Start date is after end date!');
      }
    }
  }

  removeReport(report: Report) {
    const index = this.reports.indexOf(report); 
    if (index !== -1) {
      this.reports.splice(index, 1);
    }
   }

  validDates(date1: any, date2: any) {
    if (date1.year > date2.year) {
      return false;
    }
    else if (date1.year === date2.year) {
      if (date1.month === date2.month) {
        if (date1.day > date2.day ) {
          return false;
        }
        else if (date1.day === date2.day ) {
          return true;
        }
        else {
          return true;
        }
      }
      else if (date1.month > date2.month) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

   exists(report: Report) {
     for (const r of this.reports) {
        if (this.equals(r, report)) {
          return true;
        }
    }
    return false;
   }
   
   equals(report1: Report, report2: Report) {
      return report1.date === report2.date && report1.lineName === report2.lineName;
   }
}

