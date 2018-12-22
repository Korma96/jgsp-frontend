import { Component, OnInit } from '@angular/core';
import {ZoneService} from '../../../services/transport-admin-services/zone-service/zone.service';
import {Zone} from '../../../models/zone';

@Component({
  selector: 'app-zone-page',
  templateUrl: './zone-page.component.html',
  styleUrls: ['./zone-page.component.css']
})
export class ZonePageComponent implements OnInit {
  zones: Object[];
  constructor(private zoneService: ZoneService) { }

  ngOnInit() {
    console.log('pre getAll u komponenti');
    this.zoneService.getAll().subscribe((zones: Object[]) => {
      this.zones = zones;
    });
    console.log(this.zones);
    console.log('posle getAll u komponenti');
  }

}
