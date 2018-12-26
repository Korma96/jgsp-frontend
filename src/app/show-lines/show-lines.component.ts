import { Component, OnInit, Input } from '@angular/core';
import { Line } from '../model/line';
import { colors } from '../resources/colors';

@Component({
  selector: 'app-show-lines',
  templateUrl: './show-lines.component.html',
  styleUrls: ['./show-lines.component.css']
})
export class ShowLinesComponent implements OnInit {
  title: string = 'My first AGM project';
  center: any = {lat: 45.3037048, lng: 19.8476332}; // centriranje mape otprilike na poziciju Srbije

  @Input()
  lines: Line[];

  linesForShowing: Line[];

  // arrayChecked: boolean[];

  colors: string[];  

  selectors: string = 'input:checked + .slider:before,'
                    + 'input:checked + .slider';

  
  constructor() { 
    this.linesForShowing = [];
    // this.arrayChecked = [];
    this.colors = colors;
  }

  ngOnInit() {
  }

  /*insertOrDropLine(index: number) {
    if (this.arrayChecked[index]) {
      this.arrayChecked[index] = false;
      // remove line
      this.linesForShowing.splice(index, 1);
    }
    else {
      this.arrayChecked[index] = true;
      this.linesForShowing.push(this.lines[index]);
    }

  }*/
}
