import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { Schedule } from '../model/schedule';
import { Zone } from '../model/zone';

@Component({
  selector: 'app-show-schedule',
  templateUrl: './show-schedule.component.html',
  styleUrls: ['./show-schedule.component.css']
})
export class ShowScheduleComponent implements OnInit, OnChanges {

  @Input()
  zones: Zone[];

  selectedZone: string;

  dates: string[];

  schedule: Schedule;

  relativeUrl: string;

  constructor(private scheduleService: GenericService<string>, private toastr: ToastrService, private router: Router) { 
    this.schedule = { date: null, day: 0, lines: [] };
    this.selectedZone = null;
    this.relativeUrl = '/schedule/dates';
  }

  ngOnInit() {
    this.getDates();
  }

  ngOnChanges(changes: SimpleChanges) {
    const zones: SimpleChange = changes.zones;
    
    if (!zones.firstChange) {
      console.log('prev value: ', zones.previousValue);
      console.log('got name: ', zones.currentValue);
      this.selectedZone = zones.currentValue[0];  // default-no podesavanje
    }
    
  }
  
  getDates() {
    this.scheduleService.getAll(this.relativeUrl) .subscribe(
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

  click() {
    
  }

}
