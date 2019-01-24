import { Component, OnInit } from '@angular/core';
import { Line } from 'src/app/model/line';
import { GenericService } from 'src/app/services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { Zone } from 'src/app/model/zone';
import { ZoneWithLines } from 'src/app/model/zone-with-lines';
import { ForwardingZonesService } from 'src/app/services/forwarding-zones/forwarding-zones.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  zones: ZoneWithLines[];

  postionsOfVehiclesChecked: boolean = false;
  neverShowPositionOfVehicles: boolean = true;

  constructor(private forwardingZonesService: ForwardingZonesService) {
  }

  ngOnInit() {
    this.forwardingZonesService.replaySubject.subscribe(
      (receivedZones: ZoneWithLines[]) => this.zones = receivedZones
    );
  }

}
