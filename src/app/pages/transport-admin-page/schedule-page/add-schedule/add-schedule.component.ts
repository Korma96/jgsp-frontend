import {Component, OnInit} from '@angular/core';
import {GenericService} from '../../../../services/generic/generic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CompleteLine} from '../../../../model/complete-line';
import {HelperMethodsService} from '../../../../services/generic/helper-methods.service';
import {Line} from '../../../../model/line';
import {DayType} from '../../helpers/enum/day_type';
import {LineAndTimes} from '../../../../model/line-and-times';
import {ScheduleService} from '../../../../services/schedule/schedule.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.css']
})
export class AddScheduleComponent implements OnInit {
  completeLine: CompleteLine;
  nextButtonValue: string;
  currentDay: DayType;
  chosenDate: string;
  lineWithTimes: LineAndTimes;
  schedule: any;
  allLineDatesFrom: string[];
  constructor(private genericService: GenericService,
              private scheduleService: ScheduleService,
              private route: ActivatedRoute,
              private helperMethodService: HelperMethodsService,
              private router: Router,
              private toastr: ToastrService) {
    this.chosenDate = "";
    this.currentDay = DayType.WORKDAY;
    this.nextButtonValue = "Next";
    this.schedule = { 'WORKDAY': null, 'SATURDAY': null, 'SUNDAY': null };
    this.lineWithTimes = this.getEmptyLineWithTimes();
  }

  ngOnInit() {
    let completeLineName: string = "";
    this.route.params.subscribe(res => completeLineName = res.name);
    this.genericService.getAll<Line>('/line/all').subscribe(lines => {
      const completeLines: CompleteLine[] = this.helperMethodService.getCompleteLinesFromLines(lines);
      this.completeLine = completeLines.find(c => c.name == completeLineName);
      if(this.completeLine == null){
        this.toastr.error(`Line with name ${completeLineName} doesn't exist`);
        return;
      }
      this.lineWithTimes.lineName = this.completeLine.name;
      this.genericService.getAll<string>(`/schedule/${this.completeLine.aLineId}/dates`).subscribe((dates) => {
        this.allLineDatesFrom = dates;
      }, error => { console.log(JSON.stringify(error)) });
    }, error => { console.log(JSON.stringify(error)) });
  }

  nextClick() {
    if (!this.canContinue()) {
      return;
    }
    this.schedule[this.currentDay] = this.lineWithTimes;

    switch (this.currentDay) {
      case DayType.WORKDAY:
        this.currentDay = DayType.SATURDAY;
		this.lineWithTimes = this.getEmptyLineWithTimes(this.completeLine.name);
        break;
      case DayType.SATURDAY:
        this.nextButtonValue = "Finish";
        this.currentDay = DayType.SUNDAY;
		this.lineWithTimes = this.getEmptyLineWithTimes(this.completeLine.name);
        break;
      case DayType.SUNDAY:
        this.scheduleService.saveSchedule({'lineId': this.completeLine.aLineId, 'dateFrom': this.chosenDate,
          'times': [this.schedule[DayType.WORKDAY].timesA, this.schedule[DayType.SATURDAY].timesA, this.schedule[DayType.SUNDAY].timesA]}).subscribe(() => {
          this.scheduleService.saveSchedule({'lineId': this.completeLine.bLineId, 'dateFrom': this.chosenDate,
            'times': [this.schedule[DayType.WORKDAY].timesB, this.schedule[DayType.SATURDAY].timesB, this.schedule[DayType.SUNDAY].timesB]}).subscribe(() => {
              this.toastr.success(`Schedule successfully added for line ${this.completeLine.name}`);
              this.router.navigate(['transport/schedule']);
          }, error => {
              JSON.stringify(error);
              this.toastr.error(error.error.message);
            });
          }, error => {
              JSON.stringify(error);
              this.toastr.error(error.error.message);
        });
        break;
    }
  }

  getEmptyLineWithTimes(lineName: string = '') : LineAndTimes{
    return {'lineName': lineName, 'timesA': [], 'timesB': [] };
  }

  canContinue(): boolean {
    if(this.chosenDate.trim() === ""){
      this.toastr.warning('Valid from can`t be empty!');
      return false;
    }
    if(this.allLineDatesFrom.findIndex(x => x === this.chosenDate.trim()) !== -1){
      this.toastr.warning('Schedule valid from date \nfor line already exists!');
      return false;
    }
    if(this.lineWithTimes.timesA.length === 0){
      this.toastr.warning('Direction A must have at least one time!');
      return false;
    }
    if(this.lineWithTimes.timesB.length === 0){
      this.toastr.warning('Direction B must have at least one time!');
      return false;
    }

    return true;
  }

}
