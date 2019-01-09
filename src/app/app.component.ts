import { Component, OnInit } from '@angular/core';
import { ZoneWithLines } from './model/zone-with-lines';
import { GenericService } from './services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { ForwardingZonesService } from './services/forwarding-zones/forwarding-zones.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  zones: ZoneWithLines[];

  private relativeUrl: string;
  

  constructor(private lineService: GenericService, private toastr: ToastrService,
              private forwardingZonesService: ForwardingZonesService) {
    this.relativeUrl = '/zone/all-with-line';
  }

  ngOnInit() {
    this.getZones();
  }

  getZones() {
    this.lineService.getAll<ZoneWithLines>(this.relativeUrl) .subscribe(
      zones => {
        this.zones = zones;
        if (this.zones) {
          if (this.zones.length > 0) {
            this.zones.forEach(
              zone => this.setDistinctLines(zone)
            );
            this.forwardingZonesService.sendZones(this.zones);
            this.toastr.success('Zones are successfully loaded!');
          }
          else {
            this.toastr.warning('There are no zones at the moment!');
          }
        }
        else {
          this.toastr.error('Problem with loading zones!');
        }
      },
      err => this.toastr.error('Error: ' + JSON.stringify(err))
    );
  }


  setDistinctLines(zone: ZoneWithLines) {
    if (zone.lines.length > 0) {
      const lines: string[] = [];

      zone.lines.forEach(
        line => {
          let lineName = line.name;
          lineName = lineName.substring(0, lineName.length - 1);
          const notYetInLines: boolean = lines.filter(name => name === lineName).length === 0;
          if (notYetInLines) {
            lines.push(lineName);
          }
        }
      );

      zone.distinctLines = lines;
    }
    
  }
}
