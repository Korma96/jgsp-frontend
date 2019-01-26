import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Line} from '../../../../model/line';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {
  @Input() line: Line;
  @Input() isManipulateButtonDisabled: boolean;
  @Input() buttonSign: string;
  @Output() lineManipulateEventHandler: EventEmitter<number> = new EventEmitter<number>();
  @Output() lineButtonEventHandler: EventEmitter<number> = new EventEmitter<number>();
  constructor() {
    this.isManipulateButtonDisabled = false;
  }

  ngOnInit() {

  }

  deleteLine(lineId: number) {
    this.lineManipulateEventHandler.next(lineId);
  }

  lineClick(lineId: number) {
    this.lineButtonEventHandler.next(lineId);
  }
}
