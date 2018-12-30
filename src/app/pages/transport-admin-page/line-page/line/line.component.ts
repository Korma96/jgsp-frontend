import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Line} from '../../../../model/line';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {
  @Input() line: Line;
  @Input() buttonSign: string;
  @Output() lineIdEventHandler: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  deleteLine(lineId: number) {
    this.lineIdEventHandler.next(lineId);
  }
}
