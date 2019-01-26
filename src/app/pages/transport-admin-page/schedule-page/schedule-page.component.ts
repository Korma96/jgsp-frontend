import { Component, OnInit } from '@angular/core';
import {Line} from '../../../model/line';
import {GenericService} from '../../../services/generic/generic.service';
import {HelperMethodsService} from '../../../services/generic/helper-methods.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CompleteLine} from '../../../model/complete-line';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent implements OnInit {
  lines: Line[];
  completeLines: CompleteLine[];
  completeLinesView: CompleteLine[][];
  elemsPerRow: number;
  constructor(private genericService: GenericService,
              private helperMethodService: HelperMethodsService,
              private router: Router) {
    this.elemsPerRow = 5;
  }

  ngOnInit() {
    this.genericService.getAll<Line>('/line/all').subscribe(lines => {
         this.lines = lines;
         this.completeLines = this.helperMethodService.getCompleteLinesFromLines(lines);
         this.completeLinesView = this.helperMethodService.getListOfLists<CompleteLine>(this.elemsPerRow, this.completeLines);
      }, error => { console.log(JSON.stringify(error)) });
    }

  lineClicked(completeLineName: string) {
    this.router.navigate([`transport/update_schedule/${completeLineName}`]);
  }

  addScheduleClicked(completeLineName: string) {
    this.router.navigate([`transport/add_schedule/${completeLineName}`])
  }
}
