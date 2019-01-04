import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ZoneWithLines } from '../model/zone-with-lines';
import { TicketDto } from '../model/ticket-dto';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit, OnChanges {

  transports: string[] = ['bus', 'tram', 'metro'];
  ticketTypes: string[] = ['onetime', 'daily', 'monthly', 'yearly'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septembr',
                      'October', 'November', 'December'];
  currentMonth: number = new Date().getMonth();

  selectedMonth: number;

  transport: number;

  ticket: TicketDto;

  date: any;

  selectedZone: ZoneWithLines;

  relativeUrl: string;

  @Output()
  boughtTicketEvent = new EventEmitter();

  @Input()
  zones: ZoneWithLines[]; 

  constructor(private genericService: GenericService, private toastr: ToastrService) { 
    this.transport = 0;
    this.selectedMonth = this.currentMonth + 1; // +1 posto indeksi za currentMonth krecu od nule
    this.ticket = { hasZoneNotLine: true, name: null, dayInMonthOrMonthInYear: -1, 
      ticketType: this.ticketTypes[1].toUpperCase() };
    
    this.relativeUrl = '/passengers/buy-ticket';
  }

  ngOnInit() {
    if (this.zones) {
        if (this.zones.length > 0) {
          this.selectedZone = this.zones[0];
        }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const zones: SimpleChange = changes.zones;
    
    if (!zones.firstChange) {
      console.log('prev value: ', zones.previousValue);
      console.log('got name: ', zones.currentValue);
      if (zones.currentValue.length > 0) {
        this.selectedZone = zones.currentValue[0];  // default-no podesavanje
        if (this.selectedZone.distinctLines) {
            if (this.selectedZone.distinctLines.length > 0) {
              this.ticket.name = this.selectedZone.distinctLines[0];
            }
        }
        
      }
      
    }
    
  }

  selectedZoneChanged() {
    if (this.selectedZone) {
        if (this.selectedZone.distinctLines) {
            if (this.selectedZone.distinctLines.length > 0) {
              this.ticket.name = this.selectedZone.distinctLines[0];
              return;
            }
          
        }   
    }

    this.ticket.name = null;
  }

  hasZoneNotLineChanged() {
    this.ticket.hasZoneNotLine = !this.ticket.hasZoneNotLine;

    if (!this.ticket.hasZoneNotLine) {
      this.selectedZoneChanged();
    }
  }

  transportChanged() {
    this.selectedZone = this.zones.filter(zone => zone.transport === this.transports[this.transport])[0];
    this.selectedZoneChanged();
  }

  buyTicket() {
    if (this.ticket.hasZoneNotLine) {
        this.ticket.name = this.selectedZone.name;
    }

    let stopBuying: boolean = false;

    if (this.ticket.ticketType === this.ticketTypes[1].toUpperCase()) {
        if (!this.date) {
          this.toastr.error('You did not select a date!');
          stopBuying = true;
        }
        else {
          this.ticket.dayInMonthOrMonthInYear = this.date.day;
        }
    }
    else if (this.ticket.ticketType === this.ticketTypes[2].toUpperCase()) {
      if (this.selectedMonth < this.currentMonth || this.selectedMonth > 12) {
        this.toastr.error('You did not select valid month!');
        stopBuying = true;
      }
      else {
        this.ticket.dayInMonthOrMonthInYear = this.selectedMonth;
      }
    }

    if (stopBuying) {
      return;
    }

    this.genericService.save(this.relativeUrl, this.ticket).subscribe(
      () => {
        this.boughtTicketEvent.emit();
        this.toastr.success('You have successfully bought a ticket!');
      },
      () => this.toastr.error('You have unsuccessfully bought a ticket!')
    );
  
  }  

}
