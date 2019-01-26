import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-add-time',
  templateUrl: './add-time.component.html',
  styleUrls: ['./add-time.component.css']
})
export class AddTimeComponent implements OnInit {
  value: string;
  @Output() addTimeEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor() {
    this.value = "";
  }

  ngOnInit() {
  }

  addTime() {
    this.addTimeEmitter.next(this.value);
  }
}
