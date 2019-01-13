import { Component, OnInit, Input} from '@angular/core';

import { ZoneWithLines } from '../model/zone-with-lines';


@Component({
  selector: 'app-positions-of-vehicles',
  templateUrl: './positions-of-vehicles.component.html',
  styleUrls: ['./positions-of-vehicles.component.css']
})
export class PositionsOfVehiclesComponent implements OnInit {

  @Input()
  zones: ZoneWithLines[];

  neverShowPositionOfVehicles: boolean = false;
  postionsOfVehiclesChecked: boolean = true;


  constructor() {}

  ngOnInit() {

  }

  // u ovoj metodi, poruka se salje preko websocketa
  /*sendMessage(message){
    this.stompClient.send(this.baseUrl + '/app/socket', {}, message); // {} je hraders
    //$('#input').val('');
  }*/


}
