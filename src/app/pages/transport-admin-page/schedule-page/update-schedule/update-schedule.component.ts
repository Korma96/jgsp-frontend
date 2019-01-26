import { Component, OnInit } from '@angular/core';
import {CompleteLine} from '../../../../model/complete-line';
import {LineAndTimes} from '../../../../model/line-and-times';
import {GenericService} from '../../../../services/generic/generic.service';
import {TimesService} from '../../../../services/times.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HelperMethodsService} from '../../../../services/generic/helper-methods.service';
import {ToastrService} from 'ngx-toastr';
import {Line} from '../../../../model/line';
import {ScheduleService} from '../../../../services/schedule/schedule.service';

@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrls: ['./update-schedule.component.css']
})
export class UpdateScheduleComponent implements OnInit {
  completeLine: CompleteLine;
  dates: string[];
  selectedDate: string;
  selectedDay: number;
  lineWithTimes: LineAndTimes;
  relativeUrlForTimes: string;
  constructor(private genericService: GenericService,
              private scheduleService: ScheduleService,
              private timesService: TimesService,
              private route: ActivatedRoute,
              private helperMethodService: HelperMethodsService,
              private router: Router,
              private toastr: ToastrService) {
    this.relativeUrlForTimes = '/line/departure-lists';
    this.selectedDay = 0;
    this.lineWithTimes = {'lineName': '', 'timesA': [], 'timesB': [] };
  }

  ngOnInit() {
    try {
      let completeLineName: string = "";
      this.route.params.subscribe(res => completeLineName = res.name);
      this.genericService.getAll<Line>('/line/all').subscribe(lines => {
        const completeLines: CompleteLine[] = this.helperMethodService.getCompleteLinesFromLines(lines);
        this.completeLine = completeLines.find(c => c.name == completeLineName);
        if (this.completeLine == null) {
          this.toastr.error(`Line with name ${completeLineName} doesn't exist`);
          return;
        }
        this.getDates();
      }, error => {
        console.log(JSON.stringify(error))
      });
    }catch(e){
      console.log(JSON.stringify(e));
    }
  }

  getDates() {
    this.scheduleService.getDates(this.completeLine.aLineId).subscribe(dates => {
      this.dates = dates;
      if (this.dates) {
        if (this.dates.length > 0) {
          this.selectedDate = this.dates[0];
          this.showTimeTable();
        }
      }
     },
     error => alert('Error: ' + JSON.stringify(error))
    );
  }

  showTimeTable() {
    if(this.selectedDate != null){
      this.lineWithTimes.lineName = this.completeLine.name;
      this.scheduleService.getTimes(this.completeLine.aLineId, this.selectedDate, this.selectedDay).subscribe((times) => {
        this.lineWithTimes.timesA = times;
      }, error => console.log(JSON.stringify(error)));
      this.scheduleService.getTimes(this.completeLine.bLineId, this.selectedDate, this.selectedDay).subscribe((times) => {
        this.lineWithTimes.timesB = times;
      }, error => console.log(JSON.stringify(error)));
    }
  }

}
