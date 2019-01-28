import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZoneWithLines } from 'src/app/model/zone-with-lines';
import { ForwardingZonesService } from 'src/app/services/forwarding-zones/forwarding-zones.service';
import { Ticket } from 'src/app/model/ticket';
import { GenericService } from 'src/app/services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { TicketDto } from 'src/app/model/ticket-dto';
import { IndexAndDateTime } from 'src/app/model/indexAndDateTime';

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
              this.sortTickets();
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
       err => this.toastr.error('Error: ' + JSON.stringify(err))
    );
  }

  boughtTicket(ticket: Ticket) {
    //this.getTickets();
    this.tickets.push(ticket);
    this.sortTickets();
    this.toastr.success('You have successfully bought a ticket!');
  }

  sortTickets() {
    const currentDateTime: Date = new Date();
    let startDateAndTime, endDateAndTime: Date;

    const past: IndexAndDateTime[] = [];
    const currentlyActive: IndexAndDateTime[] = [];
    const future: IndexAndDateTime[] = [];
    
    const sortedTickets = [];

    let indexAndDateTime: IndexAndDateTime;

    for (let i = 0; i < this.tickets.length; i++) {
        if (this.tickets[i].startDateAndTime === 'not yet activated') {
          currentlyActive.push({ index: i, dateTime: null });
          continue;
        }
        startDateAndTime = this.convertStringToDate(this.tickets[i].startDateAndTime);
        endDateAndTime = this.convertStringToDate(this.tickets[i].endDateAndTime);
        indexAndDateTime = { index: i, dateTime: startDateAndTime };
        if (startDateAndTime >= currentDateTime) {
          future.push(indexAndDateTime);
        }
        else {
          if (endDateAndTime <= currentDateTime) {
            past.push(indexAndDateTime);
          }
          else {
            currentlyActive.push(indexAndDateTime);
          }
          
        }
    }

    this.sortPartOfTickets(sortedTickets, currentlyActive, currentDateTime);
    this.sortPartOfTickets(sortedTickets, future, currentDateTime);
    this.sortPartOfTickets(sortedTickets, past, currentDateTime);

    this.tickets = sortedTickets;

  }

  sortPartOfTickets(sortedTickets: Ticket[], partOfTickets, currentDateTime: Date) {
    let indexOfNearest: number = -1;
    let diff: number;
    let minDiff = Number.MAX_SAFE_INTEGER;

    while (partOfTickets.length > 0) {
      for (let i = 0; i < partOfTickets.length; i++) {
        if (!partOfTickets[i].dateTime) {
          indexOfNearest = i;
          break;
        }
        diff = Math.abs(partOfTickets[i].dateTime.valueOf() - currentDateTime.valueOf());
        if (diff < minDiff) {
          minDiff = diff;
          indexOfNearest = i;
        }
      }
  
      if (indexOfNearest === -1 || indexOfNearest >= partOfTickets.length) {
        this.toastr.error('Error (during the sorting of tickets)');
        return;
      }
      else {
        sortedTickets.push(this.tickets[partOfTickets[indexOfNearest].index]);
      }

      partOfTickets.splice(indexOfNearest, 1);
      indexOfNearest = -1;
      minDiff = Number.MAX_SAFE_INTEGER;
    }
    
  }  

  convertStringToDate(dateStr: string) {
    const tokens = dateStr.split('.');
    const tokens2 = tokens[3].trim().split(':');
    return new Date(+tokens[2], +tokens[1] - 1, +tokens[0], +tokens2[0], +tokens2[1]);
  }

}
