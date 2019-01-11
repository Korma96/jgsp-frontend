import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Ticket } from '../model/ticket';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { DownloadFileService } from '../services/download-file/download-file.service';
import { DateTimesAndPrice } from '../model/date-times-and-price';

@Component({
  selector: 'app-show-tickets',
  templateUrl: './show-tickets.component.html',
  styleUrls: ['./show-tickets.component.css']
})
export class ShowTicketsComponent implements OnInit, OnChanges {

  @Input()
  tickets: Ticket[];

  realtiveUrlForCheckOnetimeTicket: string;
  realtiveUrlForRemoveTicket: string;

  constructor(private downloadFileService: DownloadFileService, private genericService: GenericService,
              private toastr: ToastrService) { 
      this.tickets = [];
      this.realtiveUrlForCheckOnetimeTicket = '/passengers/check-onetime-ticket';
      this.realtiveUrlForRemoveTicket = '/passengers';
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      const tickets: SimpleChange = changes.tickets;
      if(tickets && !tickets.firstChange) {
        if(tickets.currentValue) {
          this.tickets = [...tickets.currentValue];
        }
      }
      
  }

  download(id: number) {
      this.downloadFileService.getPdfFile(id);

  }

  canRemove(ticket: Ticket): boolean {
    if(ticket.startDateAndTime === 'not yet activated') {
        return true;
    }

    const tokensStart = ticket.startDateAndTime.split('.');
    const tokens2Start = tokensStart[3].trim().split(':');
    const tokensEnd = ticket.endDateAndTime.split('.');
    const tokens2End = tokensEnd[3].trim().split(':');

    let startDateTime = new Date(+tokensStart[2],+tokensStart[1]-1,+tokensStart[0],+tokens2Start[0],+tokens2Start[1]);
    let endDateTime = new Date(+tokensEnd[2],+tokensEnd[1]-1,+tokensEnd[0],+tokens2End[0],+tokens2End[1]);

    const currentDateTime = new Date();
    let retValue: boolean = startDateTime > currentDateTime || currentDateTime > endDateTime;
    
    return retValue;
  }

  remove(id: number) {
    this.genericService.delete(this.realtiveUrlForRemoveTicket, id).subscribe(
      () => {
          let indexForRemove = -1;

          for(let i = 0; i < this.tickets.length; i++) {
            if(this.tickets[i].id === id) {
                indexForRemove = i;
                break;
            }
          }

          if(indexForRemove > -1) {
            this.tickets.splice(indexForRemove, 1);
          }

          this.toastr.success('Ticket successfully removed!');
      },
      err => this.toastr.error('Ticket unsuccessfully removed!')
    );
  }

  canActivate(ticket: Ticket): boolean {
    return (ticket.ticketType == 'onetime' || ticket.ticketType == 'ONETIME') 
            && (!ticket.startDateAndTime || ticket.startDateAndTime == 'not yet activated');
  }

  activate(id: number) {
      this.genericService.putWithId<number>(this.realtiveUrlForCheckOnetimeTicket, id).subscribe(
        (retValue: DateTimesAndPrice) => {
          if(retValue) {
            this.tickets.forEach(ticket => {
              if(ticket.id === id) {
                ticket.startDateAndTime = retValue.startDateTime;
                ticket.endDateAndTime = retValue.endDateTime;
                ticket.price = retValue.price;
              }
            });
            this.toastr.success('Ticket successfully activated!');
          }
          else {
            this.toastr.error('Ticket unsuccessfully activated!');
          }
        },
        err => this.toastr.error('Ticket unsuccessfully activated!')
      );
  }

}
