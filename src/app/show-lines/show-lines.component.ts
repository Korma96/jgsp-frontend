import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Line } from '../model/line';
import { colors } from '../resources/colors';
import { ZoneWithLines } from '../model/zone-with-lines';
import { DirectionsMapComponent } from '../directions-map/directions-map.component';

@Component({
  selector: 'app-show-lines',
  templateUrl: './show-lines.component.html',
  styleUrls: ['./show-lines.component.css']
})
export class ShowLinesComponent implements OnInit {
  center: any = {lat: 45.3037048, lng: 19.8476332}; // centriranje mape otprilike na poziciju Srbije

  @Input()
  zones: ZoneWithLines[];

  @Input()
  postionsOfVehiclesChecked: boolean;

  @Input()
  neverShowPositionOfVehicles: boolean;

  @ViewChild(DirectionsMapComponent ) childDirectionsMap: DirectionsMapComponent ; 

  transports: string[] = ['all', 'bus', 'tram', 'metro'];

  transport: number;

  colors: string[];  

  selectors: string = 'input:checked + .slider:before,'
                    + 'input:checked + .slider';

  
  constructor() { 
    this.transport = 0;
    this.colors = colors;
  }

  ngOnInit() {
  }

  linesDisplayed() {
    return this.childDirectionsMap.linesDisplayed();
  }
}
