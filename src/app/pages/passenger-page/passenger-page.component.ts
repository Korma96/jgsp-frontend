import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZoneWithLines } from 'src/app/model/zone-with-lines';
import { ForwardingZonesService } from 'src/app/services/forwarding-zones/forwarding-zones.service';
import { Ticket } from 'src/app/model/ticket';
import { GenericService } from 'src/app/services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-passenger-page',
  templateUrl: './passenger-page.component.html',
  styleUrls: ['./passenger-page.component.css']
})
export class PassengerPageComponent implements OnInit {
  busIcon: string = '/assets/icons/bus.png';
  tramIcon: string = '/assets/icons/tram.png';
  metroIcon: string = '/assets/icons/metro.png';

  zones: ZoneWithLines[]; 

  tickets: Ticket[];

  relativeUrlGetTickets: string;


  constructor(private genericService: GenericService, private forwardingZonesService: ForwardingZonesService,
              private toastr: ToastrService) { 

      this.relativeUrlGetTickets = '/passengers/get-tickets';
  }

  ngOnInit() {
    this.getTickets();

    this.forwardingZonesService.replaySubject.subscribe(
      (receivedZones: ZoneWithLines[]) => this.zones = receivedZones
    );
  }

  getTickets() {
    this.genericService.getAll<Ticket>(this.relativeUrlGetTickets).subscribe(
        (tickets: Ticket[]) => {
          this.tickets = tickets;

          if (this.tickets) {
            if (this.tickets.length > 0) {
              this.toastr.success('Tickets are successfully loaded!');
            }
            else {
              this.toastr.warning('There are no tickets at the moment!');
            }
          }
          else {
            this.toastr.error('Problem with loading tickets!');
          }
       },
       error => console.log('Error: ' + JSON.stringify(error))
    );
}

}
