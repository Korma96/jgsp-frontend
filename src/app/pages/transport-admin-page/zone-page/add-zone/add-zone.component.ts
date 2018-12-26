import {Component, OnInit, Output} from '@angular/core';
import {Zone} from '../../../../model/zone';
import {Line} from '../../../../model/line';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.css']
})
export class AddZoneComponent implements OnInit {
  @Output() zone: Zone;
  zoneLines: Line[];
  constructor() { }

  ngOnInit() {
    this.zoneLines = [{ id: 1, name: '111' }];
  }

}
