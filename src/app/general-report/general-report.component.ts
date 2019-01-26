import { Component, OnInit } from '@angular/core';
import { Report } from '../model/report';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../services/report.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.css']
})
export class GeneralReportComponent implements OnInit {

  date1: any;
  date2: any;
  reports: Report[];
  relativeUrl: string;

  constructor(private reportService: ReportService, private toastr: ToastrService) {
    this.relativeUrl = '/userAdmin/general-report';
    this.reports = [];
   }

  ngOnInit() {
  }

  showReports() {
    if (this.date1 === undefined || this.date2 === undefined){
      this.toastr.error('You have to pick start and end date!');
    }
    else {
      if (this.validDates(this.date1, this.date2)) {
      let date1Str = this.date1.year +'-'+this.date1.month + '-'+ this.date1.day;
      let date2Str = this.date2.year +'-'+this.date2.month + '-'+ this.date2.day;
      this.reportService.getGeneralReport<Report>(this.relativeUrl, date1Str, date2Str).subscribe(
        (report: Report) => {
          if (date1Str === date2Str){
            report.date = date1Str;
          }
          else{
            report.date = date1Str + " - "+ date2Str;
          }
          if (!this.exists(report)) {
            this.reports.push(report);
          }
          if (this.reports.length > 10) {
            this.reports.splice(0,1);
          }
          if (!this.reports) {
            this.toastr.error('Problem with loading of report!');
          }
        },
        error => console.log('Error: ' + JSON.stringify(error))
      );
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
    else if (date1.year == date2.year) {
      if (date1.month == date2.month) {
        if (date1.day > date2.day ) {
          return false;
        }
        else if (date1.day == date2.day ) {
          return true;
        }
        else {
          return true;
        }
      }
      else if (date1.month > date2.month){
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return true;
    }
  }

   exists(report: Report) {
     for (let r of this.reports) {
        if (this.equals(r,report)) {
          return true;
        }
    }
    return false;
   }
   
   equals(report1: Report, report2: Report) {
      return report1.date === report2.date;
   }
}
