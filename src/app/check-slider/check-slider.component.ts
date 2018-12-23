import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-check-slider',
  templateUrl: './check-slider.component.html',
  styleUrls: ['./check-slider.component.css']
})
export class CheckSliderComponent implements OnInit {
  isChecked: boolean;

  @Output()
  changedStateEvent: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor() { 
    this.isChecked = false;
  }

  ngOnInit() {
  }

  changedState() {
    this.isChecked = !this.isChecked;
    this.sendEvent();
  }

  sendEvent() {
    this.changedStateEvent.emit(this.isChecked);
  }

}
