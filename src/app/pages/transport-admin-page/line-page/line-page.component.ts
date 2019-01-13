import { Component, OnInit } from '@angular/core';
import { Line } from '../../../model/line';
import { GenericService } from '../../../services/generic/generic.service';
import { LineService } from '../../../services/transport-admin-services/line-service/line.service';
import {HelperMethodsService} from '../../../services/generic/helper-methods.service';
import {Zone} from '../../../model/zone';
import {ToastrService} from 'ngx-toastr';
import {CompleteLine} from '../../../model/complete-line';

@Component({
  selector: 'app-line-page',
  templateUrl: './line-page.component.html',
  styleUrls: ['./line-page.component.css']
})
export class LinePageComponent implements OnInit {
  center: any = {lat: 45.257136, lng: 19.825549};
  elemsPerRow: number = 5;
  lines: Line[] = [];
  linesView: Line[][] = [];
  completeLines: CompleteLine[];

  constructor(private lineService: LineService,
              private helperMethodService: HelperMethodsService,
              private toastr: ToastrService,
              private genericService: GenericService) {
  }

  ngOnInit() {
    this.genericService.getAll<Line>('/line/all').subscribe(lines => {
      this.lines = lines;
      this.completeLines = this.helperMethodService.getCompleteLinesFromLines(lines);
      this.updateLinesView();
    });
  }

  delete(lineId: number) {
    let index: number = this.completeLines.findIndex(x => x.aLineId === lineId);
    if (index === -1) {
      index = this.completeLines.findIndex(x => x.bLineId === lineId);
    }
    const completeLine: CompleteLine = this.completeLines[index];
    this.genericService.delete('/line', completeLine.aLineId).subscribe(() => {
      this.genericService.delete('/line', completeLine.bLineId).subscribe(() => {
        this.completeLines.splice(index, 1);
        const aLineIndex: number = this.lines.findIndex(x => x.id === completeLine.aLineId);
        this.lines.splice(aLineIndex, 1);
        const bLineIndex: number = this.lines.findIndex(x => x.id === completeLine.bLineId);
        this.lines.splice(bLineIndex, 1);
        this.updateLinesView();
        this.toastr.success('Line successfully deleted');
      }, error => {
        console.log(JSON.stringify(error));
      });
    }, error => {
      console.log(JSON.stringify(error));
    });
  }

  toggleLine() {

  }

  updateLinesView() {
    this.linesView = this.helperMethodService.getListOfLists<Line>(this.elemsPerRow, this.lines);
  }
}
