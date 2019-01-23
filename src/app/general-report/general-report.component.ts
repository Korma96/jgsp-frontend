import { Component, OnInit } from '@angular/core';
import { Report } from '../model/report';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.css']
})
export class GeneralReportComponent implements OnInit {

  date1: any;
  date2: any;
  report: Report;
  relativeUrl: string;

  constructor(private adminService: GenericService, private toastr: ToastrService) {
    this.relativeUrl = '/userAdmin/general-report';
   }

  ngOnInit() {
  }

  showReports() {
    alert(`date1= ${this.date1.day}.${this.date1.month}.${this.date1.year}.`
    + `date2= ${this.date2.day}.${this.date2.month}.${this.date2.year}.`);
    
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
