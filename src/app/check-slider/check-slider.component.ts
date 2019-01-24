import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CheckSliderService } from '../services/check-slider/check-slider.service';
import { Line } from '../model/line';


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
    /*console.log('check-slider (completeLine) id: ' + this.line.id
      + ', completeLine name: ' + this.line.name);*/
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
