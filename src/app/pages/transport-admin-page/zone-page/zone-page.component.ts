import { Component, OnInit } from '@angular/core';
import {ZoneService} from '../../../services/transport-admin-services/zone-service/zone.service';
import {Zone} from '../../../model/zone';

@Component({
  selector: 'app-zone-page',
  templateUrl: './zone-page.component.html',
  styleUrls: ['./zone-page.component.css']
})
export class ZonePageComponent implements OnInit {
  zones: Object[];
  constructor(private zoneService: ZoneService) { }

  ngOnInit() {
    this.zoneService.getAll().subscribe((zones: Object[]) => {
      this.zones = zones;
    });
    console.log(this.zones);
  }

}
