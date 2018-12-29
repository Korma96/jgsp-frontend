import { Component, OnInit } from '@angular/core';
import {ZoneService} from '../../../services/transport-admin-services/zone-service/zone.service';
import {Zone} from '../../../model/zone';
import {GenericService} from '../../../services/generic/generic.service';
import {HelperMethodsService} from '../../../services/generic/helper-methods.service';

@Component({
  selector: 'app-zone-page',
  templateUrl: './zone-page.component.html',
  styleUrls: ['./zone-page.component.css']
})
export class ZonePageComponent implements OnInit {
  zones: Zone[] = [];
  zonesView: Zone[][] = [];

  constructor(private zoneService: ZoneService, private genericService: GenericService,
              private helperMethodService: HelperMethodsService) { }

  ngOnInit() {
    this.genericService.getAll<Zone>('/zone/all').subscribe(zones => {
      this.zones = zones;
      this.updateZonesView();
    });
  }

  delete(zoneId: number) {
    const index: number = this.zones.findIndex(x => x.id === zoneId);
    this.zones.splice(index, 1);
    // TO DO: delete on server
    this.updateZonesView();
  }

  updateZonesView() {
    this.zonesView = this.helperMethodService.getListOfLists<Zone>(4, this.zones);
  }

}
