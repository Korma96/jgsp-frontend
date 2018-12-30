import { Component, OnInit } from '@angular/core';
import {GenericService} from '../../../services/generic/generic.service';
import {Stop} from '../../../model/stop';
import {StopService} from '../../../services/transport-admin-services/stop-service/stop.service';

@Component({
  selector: 'app-stop-page',
  templateUrl: './stop-page.component.html',
  styleUrls: ['./stop-page.component.css']
})
export class StopPageComponent implements OnInit {
  stops: Stop[];
  constructor(private stopService: StopService, private genericService: GenericService) { }

  ngOnInit() {
    this.genericService.getAll<Stop>('/stop/all').subscribe(stops => this.stops = stops );
  }
}
