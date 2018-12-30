import { Component, OnInit, Input } from '@angular/core';
import { LineAndTimes } from '../model/line-and-times';

@Component({
  selector: 'app-show-times',
  templateUrl: './show-times.component.html',
  styleUrls: ['./show-times.component.css']
})
export class ShowTimesComponent implements OnInit {

  @Input()
  linesWithTimes: LineAndTimes[];

  constructor() { }

  ngOnInit() {
  }

}
