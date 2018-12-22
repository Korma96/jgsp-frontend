import { Component, OnInit, Input } from '@angular/core';
import { Line } from '../model/line';

@Component({
  selector: 'app-my-google-map',
  templateUrl: './my-google-map.component.html',
  styleUrls: ['./my-google-map.component.css']
})
export class MyGoogleMapComponent implements OnInit {
  title: string = 'My first AGM project';
  center: any = {lat: 45.3037048, lng: 19.8476332}; // centriranje mape otprilike na poziciju Srbije

  @Input()
  lines: Line[];

  linesForShowing: Line[];

  constructor() { 
    this.linesForShowing = [];
  }

  ngOnInit() {
  }

  insertOrDropLine(isChecked: boolean, index: number) {
    const currentLine: Line = this.lines[index];

    if (isChecked) {
      // remove line
      this.linesForShowing.filter(line => line.id !== currentLine.id);
    }
    else {
      this.linesForShowing.push(currentLine);
    }
  }

}
