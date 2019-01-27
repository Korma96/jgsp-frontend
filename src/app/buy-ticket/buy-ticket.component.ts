import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ZoneWithLines } from '../model/zone-with-lines';
import { TicketDto } from '../model/ticket-dto';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { PriceService } from '../services/price/price.service';
import { Ticket } from '../model/ticket';
import { NgbCalendar, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './ngb-date-custom-parser-formatter/ngb-date-custom-parser-formatter';

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
  
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();

  selectedMonth: number;

  transport: number;

  ticket: TicketDto;

  date: NgbDateStruct;

  selectedZone: ZoneWithLines;

  relativeUrlForBuyTicket: string;

  price: number;

  @Output()
  boughtTicketEvent = new EventEmitter<Ticket>();
  

  @Input()
  zones: ZoneWithLines[]; 

  constructor(private genericService: GenericService, private toastr: ToastrService,
              private priceService: PriceService,
              private calendar: NgbCalendar,
              private ngbDateParserFormatter: NgbDateParserFormatter) {
    this.transport = 0;
    this.selectedMonth = this.currentMonth + 1; // +1 posto indeksi za currentMonth krecu od nule
    this.ticket = { hasZoneNotLine: true, name: null, dayInMonthOrMonthInYear: -1, 
      ticketType: this.ticketTypes[1].toUpperCase() };
    
    this.relativeUrlForBuyTicket = '/passengers/buy-ticket';
    this.date = this.calendar.getToday();
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
        const filteredZones = zones.currentValue
                            .filter(z => z.transport === this.transports[this.transport]);
        if (filteredZones.length > 0) {
          this.selectedZone = filteredZones[0];
          if (this.selectedZone) {
            if (this.selectedZone.distinctLines) {
              if (this.selectedZone.distinctLines.length > 0) {
                this.ticket.name = this.selectedZone.distinctLines[0];
              }
            }
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
    const filteredZones = this.zones.filter(zone => zone.transport === this.transports[this.transport]);
    if (filteredZones.length > 0) {
      this.selectedZone = filteredZones[0];
    }
    this.selectedZoneChanged();
  }

  stopIfNotAllRight(event) {
    let stopBuying: boolean = false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (this.ticket.ticketType === this.ticketTypes[1].toUpperCase()) {
        if (!this.date) {
          this.toastr.error('You did not select a date!');
          stopBuying = true;
        }
        else if (new Date(this.date.year, this.date.month - 1, this.date.day) < now) {
          this.toastr.error('The selected date has already passed!');
          stopBuying = true;
        }
        else if (this.date.day && this.date.month && this.date.year) {
          this.ticket.dayInMonthOrMonthInYear = this.date.day;
        }
        else {
          this.toastr.error('Not valid date!');
          stopBuying = true;
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
      event.stopPropagation(); // dialog se nece prikazati
    }
    else {
      this.getPrice();
    }

  }

  buyTicket() {
    if (this.ticket.hasZoneNotLine) {
        this.ticket.name = this.selectedZone.name;
    }

    this.genericService.save(this.relativeUrlForBuyTicket, this.ticket).subscribe(
      (receivedTicket: Ticket) => {
        this.boughtTicketEvent.emit(receivedTicket);
        
        this.toastr.success('You have successfully bought a ticket!');
      },
      err => this.toastr.error('You have unsuccessfully bought a ticket!')
    );
  
  }  

  getPrice() {
    this.priceService.get(this.ticket.hasZoneNotLine, this.ticket.ticketType, this.selectedZone.name)
    .subscribe(
      (price: number) => {
        this.price = price;
        this.toastr.success('The price has been successfully delivered! ' + this.price);
      },
      (err) => {
        this.price = null;
        this.toastr.error('The price has not been successfully delivered!');
      }
    );
  }

}
