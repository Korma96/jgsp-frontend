import { Component, OnInit } from '@angular/core';
import { Report } from '../model/report';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from '../services/generic/generic.service';

@Component({
  selector: 'app-daily-general-report',
  templateUrl: './daily-general-report.component.html',
  styleUrls: ['./daily-general-report.component.css']
})
export class DailyGeneralReportComponent implements OnInit {
  report: Report;
  relativeUrl: string;
  date1: any;

  constructor(private adminService: GenericService, private toastr: ToastrService) {
    this.relativeUrl = '/userAdmin/daily-general-report';
   }

  ngOnInit() {
  }

  showReports() {
    alert(`date1= ${this.date1.day}.${this.date1.month}.${this.date1.year}.`);
    
    this.adminService.get<Report>(this.relativeUrl).subscribe(
      (report: Report) => { 
          this.report = report;
          if (!this.report) {
            this.toastr.error('Problem with loading of report!');
          }
      },
      error => console.log('Error: ' + JSON.stringify(error))
    );
    }
}

