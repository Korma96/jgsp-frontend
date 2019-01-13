import { Component, OnInit } from '@angular/core';
import {TransportAdminMapComponent} from '../transport-admin-map/transport-admin-map.component';
import {GoogleMapsAPIWrapper} from '@agm/core/services/google-maps-api-wrapper';
import {StopService} from '../../../services/transport-admin-services/stop-service/stop.service';
import {DirectionsMapComponent} from '../../../directions-map/directions-map.component';
import {GenericService} from '../../../services/generic/generic.service';
import {ToastrService} from 'ngx-toastr';
import {CheckSliderService} from '../../../services/check-slider/check-slider.service';

@Component({
  selector: 'app-transport-admin-line-map',
  templateUrl: './transport-admin-line-map.component.html',
  styleUrls: ['./transport-admin-line-map.component.css']
})
export class TransportAdminLineMapComponent extends DirectionsMapComponent implements OnInit {

  constructor(gmapsApi: GoogleMapsAPIWrapper,
              stopService: GenericService,
              toastr: ToastrService,
              checkSliderService: CheckSliderService) {
      super(gmapsApi, stopService, toastr, checkSliderService);
  }

  ngOnInit() {

  }

}
