import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Zone} from '../../../../model/zone';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {
  @Input() zone: Zone;
  @Input() index: number;
  @Output() deleteZoneEventHandler: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  deleteZone(zoneId: number) {
    this.deleteZoneEventHandler.next(zoneId);
  }

}
