import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Zone} from '../../../../model/zone';
import {Router} from '@angular/router';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {
  @Input() zone: Zone;
  @Output() deleteZoneEventHandler: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  deleteZone() {
    this.deleteZoneEventHandler.next(this.zone.id);
  }

  navigateToUpdateZonePage() {
    this.router.navigate([`transport/update_zone/${this.zone.id}`]);
  }
}
