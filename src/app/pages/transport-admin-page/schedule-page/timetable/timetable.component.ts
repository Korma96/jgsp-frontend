import {Component, Input, OnInit} from '@angular/core';
import {LineAndTimes} from '../../../../model/line-and-times';
import {GenericService} from '../../../../services/generic/generic.service';
import {CompleteLine} from '../../../../model/complete-line';
import {HelperMethodsService} from '../../../../services/generic/helper-methods.service';
import {ToastrService} from 'ngx-toastr';
import {ScheduleService} from '../../../../services/schedule/schedule.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  @Input()
  lineWithTimes: LineAndTimes;
  @Input()
  completeLine: CompleteLine;
  @Input()
  selectedDate: string;
  @Input()
  dayType: number;
  @Input()
  contactServer: boolean;

  constructor(private genericService: GenericService,
              private scheduleService: ScheduleService,
              private helperMethods: HelperMethodsService,
              private toastr: ToastrService) { }

  ngOnInit() {
  }

  addTimeToA(value: string) {
    if(value.trim() === ''){
      this.toastr.warning('Time can`t be empty!');
      return;
    }
    const timeIndex: number = this.lineWithTimes.timesA.findIndex(t => t === value);
    if(timeIndex !== -1){
      this.toastr.warning('Time already exists!');
      return;
    }

    if(this.contactServer){
      this.scheduleService.addTime(this.completeLine.aLineId, this.selectedDate, this.dayType, value).subscribe(() => {
        this.lineWithTimes.timesA.push(value);
        this.lineWithTimes.timesA = this.helperMethods.sortTimes(this.lineWithTimes.timesA);
      }, error1 => JSON.stringify(error1));
    } else {
      this.lineWithTimes.timesA.push(value);
      this.lineWithTimes.timesA = this.helperMethods.sortTimes(this.lineWithTimes.timesA);
    }
  }

  addTimeToB(value: string) {
    if(value.trim() === ''){
      this.toastr.warning('Time can`t be empty!');
      return;
    }
    const timeIndex: number = this.lineWithTimes.timesB.findIndex(t => t === value);
    if(timeIndex !== -1){
      this.toastr.warning('Time already exists!');
      return;
    }

    if(this.contactServer){
      this.scheduleService.addTime(this.completeLine.bLineId, this.selectedDate, this.dayType, value).subscribe(() => {
        this.lineWithTimes.timesB.push(value);
        this.lineWithTimes.timesB = this.helperMethods.sortTimes(this.lineWithTimes.timesB);
      }, error1 => JSON.stringify(error1));
    } else {
      this.lineWithTimes.timesB.push(value);
      this.lineWithTimes.timesB = this.helperMethods.sortTimes(this.lineWithTimes.timesB);
    }
  }

  removeTimeFromA(value: string) {
    const timeIndex: number = this.lineWithTimes.timesA.findIndex(t => t === value);
    const time: string = this.lineWithTimes.timesA[timeIndex];
    if(this.contactServer){
      this.scheduleService.removeTime(this.completeLine.aLineId, this.selectedDate, this.dayType, time).subscribe(() => {
        this.lineWithTimes.timesA.splice(timeIndex, 1);
      }, error1 => JSON.stringify(error1));
    } else {
      this.lineWithTimes.timesA.splice(timeIndex, 1);
    }
  }

  removeTimeFromB(value: string) {
    const timeIndex: number = this.lineWithTimes.timesB.findIndex(t => t === value);
    const time: string = this.lineWithTimes.timesB[timeIndex];
    if(this.contactServer){
      this.scheduleService.removeTime(this.completeLine.bLineId, this.selectedDate, this.dayType, time).subscribe(() => {
        this.lineWithTimes.timesB.splice(timeIndex, 1);
      }, error1 => JSON.stringify(error1));
    } else {
      this.lineWithTimes.timesB.splice(timeIndex, 1);
    }
  }
}
