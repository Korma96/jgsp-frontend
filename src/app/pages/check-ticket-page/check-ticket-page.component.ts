import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic/generic.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ForwardingZonesService } from 'src/app/services/forwarding-zones/forwarding-zones.service';
import { ZoneWithLines } from 'src/app/model/zone-with-lines';
import { enableBindings } from '@angular/core/src/render3';

@Component({
  selector: 'app-check-ticket-page',
  templateUrl: './check-ticket-page.component.html',
  styleUrls: ['./check-ticket-page.component.css']
})
export class CheckTicketPageComponent implements OnInit {

  private readonly getLinesUrl: string = '/line/all';
  private readonly getZonesUrl: string = '/zone/all';
 // private lines: string[];
  //private zones: string[];
  //private map: Object;
  private username: string;
  //public lz: string = 'line';
  private line: string;
  private enableChecking: boolean;

  private zones: ZoneWithLines[];
  transports: string[] = ['bus', 'tram', 'metro'];
  selectedZone: ZoneWithLines;
  private transport: number;


  constructor(private service: GenericService, private client: HttpClient, private toastr: ToastrService,
              private forwardingZonesService: ForwardingZonesService) { 
   /* this.lines = [];
    this.zones = [];*/
    //this.map = {};
    this.username = '';
    this.transport = 0;
    this.enableChecking = false;

    /*this.service.get(this.getLinesUrl).
    map((res: any) => {
      return res;
    })
    .subscribe( res => {
      for (let i = 0; i < res.length; i++) {
        this.lines.push(res[i]);
        this.map[res[i]['name']] = res[i]['id'];
      }
    });

    this.service.get(this.getZonesUrl).
    map((res: any) => {
      return res;
    })
    .subscribe( res => {
      for (let i = 0; i < res.length; i++) {
        this.zones.push(res[i]);
        this.map[res[i]['name']] = res[i]['id'];
      }
    });*/
  }

  ngOnInit() {
    this.forwardingZonesService.replaySubject.subscribe(
      (receivedZones: ZoneWithLines[]) => {
        this.zones = receivedZones;
        if (this.zones) {
          if (this.zones.length > 0) {
            this.selectedZone = this.zones[0];
            if (this.selectedZone) {
              if (this.selectedZone.distinctLines) {
                  this.line = this.selectedZone.distinctLines[0];
              }
            }
           
          }
        }
      }
    );
  }

  transportChanged() {
    this.selectedZone = this.zones.filter(zone => zone.transport === this.transports[this.transport])[0];
    //this.selectedZoneChanged();
  }


  /*onSelect(name) { 
      this.idLine = this.map[name];
  }*/

  checkTicket() {

    if (this.username && this.line && this.username !== '' && this.line !== '') {
      this.enableChecking = true;
    } else {
      this.toastr.error('Fields are not filled !!!');
    }

    if (this.enableChecking) {
     this.service.put('/users/checkticket/' + this.username + '/' + this.line, {}).
      subscribe((valid: boolean) => {
         if (valid) {
           this.toastr.success('There is at least one valid ticket :)');
         } else {
           this.toastr.error('There is no valid ticket!!!');
         }
      });
    }

    this.enableChecking = false;
    

  }

  /*lineCheck(value) {
      this.lz = value;

      if (this.lz === 'line') {
        this.idLine = this.map['1A'];
      } else {
        this.idLine = this.map['gradske_linije'];
      }
  }*/
}
