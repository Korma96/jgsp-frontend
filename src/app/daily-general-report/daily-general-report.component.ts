import { Component, OnInit } from '@angular/core';
import { Report } from '../model/report';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../services/report.service';
@Component({
  selector: 'app-daily-general-report',
  templateUrl: './daily-general-report.component.html',
  styleUrls: ['./daily-general-report.component.css']
})
export class DailyGeneralReportComponent implements OnInit {
  reports: Report[];
  report: Report;
  relativeUrl: string;
  date: any;

  constructor(private reportService: ReportService, private toastr: ToastrService) {
    this.relativeUrl = '/userAdmin/daily-general-report';
    this.reports = [];
   }

  ngOnInit() {
  }

  showReports() {
    if (this.date === undefined){
      this.toastr.error('You have to pick a date!');
    }
    else {
      let dateStr = this.date.year +'-'+this.date.month + '-'+ this.date.day;
      this.reportService.getDailyGeneralReport<Report>(this.relativeUrl, dateStr).subscribe(
        (report: Report) => {
          report.date = dateStr;
            if (!this.exists(report)) {
              this.reports.push(report);
            }
            if (!this.reports) {
              this.toastr.error('Problem with loading of report!');
            }
        },
        error => console.log('Error: ' + JSON.stringify(error))
      );      
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