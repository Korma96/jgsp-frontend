import { Component, OnInit } from '@angular/core';
import { Line } from 'src/app/model/line';
import { GenericService } from 'src/app/services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import { Zone } from 'src/app/model/zone';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  zones: Zone[];

  private relativeUrl: string;
  

  constructor(private lineService: GenericService<Zone>, private toastr: ToastrService) {
    this.relativeUrl = '/zone/all-with-line';
  }

  ngOnInit() {
    this.getZones();
  }

  getZones() {
    this.lineService.getAll(this.relativeUrl) .subscribe(
      zones => {
        this.zones = zones;
        if (this.zones) {
          if (this.zones.length > 0) {
            this.toastr.success('Zones are successfully loaded!');
          }
          else {
            this.toastr.warning('There are no zones at the moment!');
          }
        }
        else {
          this.toastr.error('Problem with loading zones!');
        }
      },
      error => console.log('Error: ' + JSON.stringify(error))
    );
  }

}
