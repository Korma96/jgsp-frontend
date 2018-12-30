import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompleteLine} from '../../../../model/complete-line';

@Component({
  selector: 'app-complete-line',
  templateUrl: './complete-line.component.html',
  styleUrls: ['./complete-line.component.css']
})
export class CompleteLineComponent implements OnInit {
  @Input() completeLine: CompleteLine;
  @Input() buttonSign: string;
  @Output() completeLineNameEventHandler: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  deleteCompleteLine() {
    this.completeLineNameEventHandler.next(this.completeLine.name);
  }
}
