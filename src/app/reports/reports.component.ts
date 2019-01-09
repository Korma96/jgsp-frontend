import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  
  date1: any;
  date2: any;
  constructor() { }

  ngOnInit() {
  }

  showReports() {
    alert(`date1= ${this.date1.day}.${this.date1.month}.${this.date1.year}.`
    + `date2= ${this.date2.day}.${this.date2.month}.${this.date2.year}.`);
  }

}
