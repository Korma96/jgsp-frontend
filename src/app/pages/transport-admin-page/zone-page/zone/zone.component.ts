import { Component, OnInit } from '@angular/core';
import {Zone} from '../../../../model/zone';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {
  zone: Zone;
  constructor() { }

  ngOnInit() {
  }

}
