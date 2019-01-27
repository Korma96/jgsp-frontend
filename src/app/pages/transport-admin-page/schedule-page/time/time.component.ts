import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  @Input() value: string;
  @Output() removeTimeEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor() {
    this.value = "";
  }

  ngOnInit() {
  }

  removeTime() {
    this.removeTimeEmitter.next(this.value);
  }
}
