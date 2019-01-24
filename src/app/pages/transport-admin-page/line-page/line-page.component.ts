import {Component, OnInit, ViewChild} from '@angular/core';
import { Line } from '../../../model/line';
import { GenericService } from '../../../services/generic/generic.service';
import { LineService } from '../../../services/transport-admin-services/line-service/line.service';
import {HelperMethodsService} from '../../../services/generic/helper-methods.service';
import {ToastrService} from 'ngx-toastr';
import {CompleteLine} from '../../../model/complete-line';
import {Router} from '@angular/router';
import {UpdateLineComponent} from './update-line/update-line.component';

@Component({
  selector: 'app-line-page',
  templateUrl: './line-page.component.html',
  styleUrls: ['./line-page.component.css']
})
export class LinePageComponent implements OnInit {
  elemsPerRow: number = 5;
  lines: Line[] = [];
  completeLinesView: CompleteLine[][] = [];
  completeLines: CompleteLine[];
  isCompleteLineSelected: boolean;
  selectedCompleteLine: CompleteLine;
  selectedLineA: Line;
  selectedLineB: Line;
  @ViewChild(UpdateLineComponent)
  updateLineComponent: UpdateLineComponent;

  constructor(private lineService: LineService,
              private helperMethodService: HelperMethodsService,
              private toastr: ToastrService,
              private router: Router,
              private genericService: GenericService) {
  }

  ngOnInit() {
    this.isCompleteLineSelected = false;
    this.selectedCompleteLine = null;
    this.genericService.getAll<Line>('/line/all').subscribe(lines => {
      this.lines = lines;
      this.completeLines = this.helperMethodService.getCompleteLinesFromLines(lines);
      this.updateCompleteLinesView();
    });
  }

  delete(completeLineName: string) {
    const index: number = this.completeLines.findIndex(x => x.name === completeLineName);
    const completeLine: CompleteLine = this.completeLines[index];
    this.genericService.delete('/line', completeLine.aLineId).subscribe(() => {
      this.genericService.delete('/line', completeLine.bLineId).subscribe(() => {
        this.completeLines.splice(index, 1);
        const aLineIndex: number = this.lines.findIndex(x => x.id === completeLine.aLineId);
        this.lines.splice(aLineIndex, 1);
        const bLineIndex: number = this.lines.findIndex(x => x.id === completeLine.bLineId);
        this.lines.splice(bLineIndex, 1);
        this.updateCompleteLinesView();
        this.toastr.success('Line successfully deleted');
      }, error => {
        console.log(JSON.stringify(error));
      });
    }, error => {
      console.log(JSON.stringify(error));
    });
  }

  updateCompleteLinesView() {
    this.completeLinesView = this.helperMethodService.getListOfLists<CompleteLine>(this.elemsPerRow, this.completeLines);
  }

  updateLine(completeLineName: string) {
    const index: number = this.completeLines.findIndex(x => x.name === completeLineName);
    this.selectedCompleteLine = this.completeLines[index];
    this.selectedLineA = this.lines.find(l => l.id === this.selectedCompleteLine.aLineId);
    this.selectedLineB = this.lines.find(l => l.id === this.selectedCompleteLine.bLineId);
    this.isCompleteLineSelected = true;
  }

  renameLine(newName: string) {
    if (newName.trim() === '') {
      this.toastr.warning('Zone name can`t be empty or whitespace!');
      return;
    }
    else {
      const index: number = this.completeLines.findIndex(cl => cl.name === newName);
      if (index !== -1) {
        this.toastr.warning(`Line ${newName} already exists!`);
        return;
      }
    }
    const renamedLineA: Line = {'id': this.selectedCompleteLine.aLineId, 'name': newName + 'A'};
    const renamedLineB: Line = {'id': this.selectedCompleteLine.bLineId, 'name': newName + 'B'};
    this.lineService.rename(renamedLineA).subscribe(() => {
      this.lineService.rename(renamedLineB).subscribe(() => {
        // refresh page
        window.location.reload(true);
      });
    });
  }
}
