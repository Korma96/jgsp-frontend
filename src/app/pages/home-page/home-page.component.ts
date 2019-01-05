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

  constructor(private forwardingZonesService: ForwardingZonesService) {
  }

  ngOnInit() {
    this.forwardingZonesService.replaySubject.subscribe(
      (receivedZones: ZoneWithLines[]) => this.zones = receivedZones
    );
  }

  /*private relativeUrl: string;
  

  constructor(private zoneService: GenericService, private toastr: ToastrService, 
              private forwardingZonesService: ForwardingZonesService) {
    this.relativeUrl = '/zone/all-with-line';
  }

  ngOnInit() {
    this.getZones();
  }

  getZones() {
    this.zoneService.getAll<ZoneWithLines>(this.relativeUrl) .subscribe(
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
      error => console.log('Error: ' + JSON.stringify(error))
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
    
  }*/

}
