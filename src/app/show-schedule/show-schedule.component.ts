import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { Schedule } from '../model/schedule';
import { ZoneWithLines } from '../model/zone-with-lines';
import { TimesService } from '../services/times.service';
import { LineAndTimes } from '../model/line-and-times';
import { Line } from '../model/line';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-schedule',
  templateUrl: './show-schedule.component.html',
  styleUrls: ['./show-schedule.component.css']
})
export class ShowScheduleComponent implements OnInit, OnChanges {

  @Input()
  zones: ZoneWithLines[];

  transports: string[] = ['bus', 'tram', 'metro'];
  transport: number;

  selectedZone: ZoneWithLines;

  dates: string[];

  linesWithTimes: LineAndTimes[];

  days: string[] = [ 'Workday', 'Saturday', 'Sunday' ];

  schedule: Schedule;

  relativeUrlForDates: string;
  relativeUrlForTimes: string;

  constructor(private scheduleService: GenericService, private timesService: TimesService,
             private toastr: ToastrService) { 
    this.transport = 0;
    this.schedule = { date: null, day: 0, lines: [] };
    this.selectedZone = null;
    this.linesWithTimes = [];
    this.relativeUrlForDates = '/schedule/dates';
    this.relativeUrlForTimes = '/line/departure-lists';
  }


  ngOnInit() {
    this.getDates();

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
      console.log('prev value: ', zones.previousValue);
      console.log('got name: ', zones.currentValue);
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
    this.schedule.lines = [];
  }

  selectedZoneChanged() {
    this.schedule.lines = [];
  }
  
  getTimes(): Observable<LineAndTimes[]> {
    const retValue = this.timesService.get(this.schedule.date, this.days[this.schedule.day], this.schedule.lines);
    retValue.subscribe(
      receivedLinesWithTimes => {   
        if (receivedLinesWithTimes) {
          if (receivedLinesWithTimes.length > 0) {
            for (let i = 0; i < receivedLinesWithTimes.length; i++) {
               receivedLinesWithTimes[i].lineName = this.schedule.lines[i];
            }
            this.linesWithTimes = receivedLinesWithTimes;
            this.toastr.success('Times, for checked line, are successfully loaded!');
          }
          else {
            this.toastr.warning('There are no times, for checked line, at the moment!');
          }
        }
        else {
          this.toastr.error('Problem with loading times, for checked line!');
        }

      },
      err =>  this.toastr.error('There are no schedule, for checked line, at the moment!')
    );

    return retValue;
  }

  getDates() {
    this.scheduleService.getAll<string>(this.relativeUrlForDates) .subscribe(
      dates => {
        this.dates = dates;
    
        if (this.dates) {
          if (this.dates.length > 0) {
            this.schedule.date = this.dates[0]; // default-no podesavanje
            this.toastr.success('Dates are successfully loaded!');
          }
          else {
            this.toastr.warning('There are no dates at the moment!');
          }
        }
        else {
          this.toastr.error('Problem with loading dates!');
        }

      },
      error => alert('Error: ' + JSON.stringify(error))
    );
  }


  show(el) {
      /*const linesForSending: number[] = [] 

      this.schedule.lines.forEach(
        lineId =>  {
            if (!this.times[lineId]) {
              linesForSending.push(lineId);
            }
        }
      );*/
      this.linesWithTimes = [];

      if (this.schedule.lines.length > 0) {
          const observable = this.getTimes();
          observable.subscribe(
            res => el.scrollIntoView() // kad pristignu podaci skroluj na njih  
          );
      }
      else {
          this.toastr.error('You have not selected any line!');
      }
  }

}
