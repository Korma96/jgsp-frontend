import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZoneWithLines } from '../model/zone-with-lines';


@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {

  dailyTicketType: string = 'DAILY';
  monthlyTicketType: string = 'MONTHLY';

  @Input()
  transport: string;

  @Input()
  zone: ZoneWithLines;

  @Input()
  hasZoneNotLine: boolean;

  @Input()
  line: string;

  @Input()
  ticketType: string;

  @Input()
  date: string;

  @Input()
  month: string;

  @Input()
  price: number;

  @Output() confirmedPurchase = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  confirmPurchase() {
    this.confirmedPurchase.emit();
  }

}
