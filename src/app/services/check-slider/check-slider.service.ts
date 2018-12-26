import { Injectable, Output, EventEmitter } from '@angular/core';
import { LineAndChecked } from 'src/app/model/line-and-checked';
import { Line } from 'src/app/model/line';


@Injectable({
  providedIn: 'root'
})
export class CheckSliderService {

  @Output() change: EventEmitter<LineAndChecked> = new EventEmitter<LineAndChecked>();

  toggle(liLineAndChecked: LineAndChecked) {
    this.change.emit( liLineAndChecked );
  }

}
