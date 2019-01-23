import { Component, OnInit } from '@angular/core';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { PriceticketDTO } from '../model/priceticket-dto';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-price-ticket',
  templateUrl: './add-price-ticket.component.html',
  styleUrls: ['./add-price-ticket.component.css']
})
export class AddPriceTicketComponent implements OnInit {

  public passengerTypes: string[];
  public ticketTypes: string[];
  public priceticket: PriceticketDTO;
  private readonly getZonesUrl: string = '/zone/all';
  private readonly addPriceTicketUrl: string = '/priceticket/add';

  private zones: string[];
  private map: Object;
  private df: any;
  private idZone: number;

  constructor(private service: GenericService, private toastr: ToastrService, private calendar: NgbCalendar) {
    this.passengerTypes  = ['STUDENT', 'PENSIONER', 'OTHER'];
    this.ticketTypes  = ['ONETIME', 'DAILY', 'MONTHLY', 'YEARLY'];
    this.priceticket = {id: 0, dateFrom: '', passengerType: '', ticketType: '', priceLine: 0, priceZone: 0, zone: ''};
    this.zones = [];
    this.map = {};

    this.df = this.calendar.getToday();

    this.service.get(this.getZonesUrl)
    .subscribe( (res: any) => {
      for (let i = 0; i < res.length; i++) {
        this.zones.push(res[i]);
        this.map[res[i]['name']] = res[i]['id'];
      }
    });
  }

  ngOnInit() {
    
  }

  /*onSelectPassengerType(value) {
    this.priceticket.passengerType = value;
  }
  onSelectTicketType(value) {
    this.priceticket.ticketType = value;
  }*/

  onSelectZone(name) { 
    this.priceticket.zone = name;
  }


  addPriceTicket() {

    const charactersMonth: string = String(this.df.month);


    if (charactersMonth.length === 1) {
      this.df.month = '0' + this.df.month;
    }

    const charactersDay: string = String(this.df.day);

    if (charactersDay.length === 1) {
      this.df.day = '0' + this.df.day;
    
    }


    this.priceticket.dateFrom = this.df.year + '-' + this.df.month + '-' + this.df.day; 



    return this.service.post(this.addPriceTicketUrl, this.priceticket).subscribe(
      () => this.toastr.success('Priceticket successfully added :)'),
      (err: any) => this.toastr.error('Priceticket is not added!!!')
      
    );
  }
}
