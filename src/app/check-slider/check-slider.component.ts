import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CheckSliderService } from '../services/check-slider/check-slider.service';
import { Line } from '../model/line';
import { LineAndChecked } from '../model/line-and-checked';
import { LinePageComponent } from '../pages/transport-admin-page/line-page/line-page.component';

@Component({
  selector: 'app-check-slider',
  templateUrl: './check-slider.component.html',
  styleUrls: ['./check-slider.component.css']
})
export class CheckSliderComponent implements OnInit {
  @Input()
  line: Line;
  
  isChecked: boolean;


  // @Output()
  // changedStateEvent: EventEmitter<number> = new EventEmitter<number>();


  constructor(private checkSliderService: CheckSliderService) {
    this.isChecked = false;
  }

  ngOnInit() {
    console.log('check-slider (line) id: ' + this.line.id 
      + ', line name: ' + this.line.name);
  }

  changedState() {
    // this.sendEvent();
    // this.lineAndChecked.checked = !this.lineAndChecked.checked;
    this.isChecked = !this.isChecked;
    this.checkSliderService.toggle({line: this.line, checked: this.isChecked});
  }

  /*sendEvent() {
    this.changedStateEvent.emit( this.id );
  }*/

}
