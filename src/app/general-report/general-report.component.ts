import { Component, OnInit } from '@angular/core';
import { Report } from '../model/report';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../services/report.service';
import { DatePipe } from '@angular/common';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ForwardingZonesService } from '../services/forwarding-zones/forwarding-zones.service';
import { ZoneWithLines } from '../model/zone-with-lines';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.css']
})
export class GeneralReportComponent implements OnInit {

  date1: any;
  date2: any;
  reports: Report[];
  relativeUrlDaily: string;
  relativeUrlGeneral: string;
  chart: any;
  chartData: number[];

  constructor(private reportService: ReportService, private toastr: ToastrService, 
              private ngbDateParserFormatter: NgbDateParserFormatter,
              private forwardingZonesService: ForwardingZonesService) {
    this.relativeUrlGeneral = '/userAdmin/general-report';
    this.relativeUrlDaily = '/userAdmin/daily-general-report';
    this.reports = [];
   }

  ngOnInit() {
  }

  showReports() {
    if (this.date1 === undefined || this.date2 === undefined) {
      this.toastr.error('You have to pick start and end date!');
    }
    else {
      if (this.validDates(this.date1, this.date2)) {
        const date1Str = this.date1.year + '-' + this.date1.month + '-' + this.date1.day;
        const date2Str = this.date2.year + '-' + this.date2.month + '-' + this.date2.day;
        const date1StrFront = this.ngbDateParserFormatter.format(this.date1);
        const date2StrFront = this.ngbDateParserFormatter.format(this.date2);
        if (date1Str === date2Str) {
          this.reportService.getDailyGeneralReport<Report>(this.relativeUrlDaily, date1Str).subscribe(
            (report: Report) => {
              report.date = date1StrFront;
              
              if (!this.exists(report)) {
                this.reports.push(report);
                /*
                this.chartData.push(report.onetimeProfit);
                this.chartData.push(report.dailyProfit);
                this.chartData.push(report.monthlyProfit);
                this.chartData.push(report.yearlyProfit);
                */
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
          this.reportService.getGeneralReport<Report>(this.relativeUrlGeneral, date1Str, date2Str).subscribe(
            (report: Report) => {

              report.date = date1StrFront + ' - ' + date2StrFront;

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
        this.toastr.error('Start date is after end date!');
      }
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
      return report1.date === report2.date;
   }

   removeReport(report: Report) {
    const index = this.reports.indexOf(report); 
    if (index !== -1) {
      this.reports.splice(index, 1);
    }
   }

   showChart(dataSet: number[]) {
    this.chart = new Chart ('canvas', {
    type: 'doughnut',
    data: {
      datasets: [{

        data: this.chartData

    }],
      labels: [
          'Red',
          'Yellow',
          'Blue',
          'Pink'
      ]
    },
  });
}
}
