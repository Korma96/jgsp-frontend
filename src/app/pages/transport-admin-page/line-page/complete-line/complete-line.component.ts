import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompleteLine} from '../../../../model/complete-line';

@Component({
  selector: 'app-complete-line',
  templateUrl: './complete-line.component.html',
  styleUrls: ['./complete-line.component.css']
})
export class CompleteLineComponent implements OnInit {
  @Input() isCompleteLineButtonDisabled: boolean;
  @Input() completeLine: CompleteLine;
  @Input() buttonSign: string;
  @Output() manipulateCompleteLineEventHandler: EventEmitter<string> = new EventEmitter<string>();
  @Output() completeLineClickEventHandler: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  deleteCompleteLine() {
    this.manipulateCompleteLineEventHandler.next(this.completeLine.name);
  }

  completeLineClick() {
    this.completeLineClickEventHandler.next(this.completeLine.name);
  }

}
