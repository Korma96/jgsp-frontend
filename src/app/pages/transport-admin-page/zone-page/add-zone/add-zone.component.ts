import {Component, OnInit} from '@angular/core';
import {Zone} from '../../../../model/zone';
import {GenericService} from '../../../../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.css']
})
export class AddZoneComponent implements OnInit {
  zone: Zone = { id: 0, name: '' };
  allZonesNames: string[];

  constructor(private genericService: GenericService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
      this.genericService.getAll<Zone>('/zone/all').subscribe(zones => {
        this.allZonesNames = zones.map(x => x.name);
      });
  }

  save() {
    if (this.zone.name.trim() === '') {
      this.toastr.warning('Zone name can`t be empty or whitespace!');
      return;
    }
    if (this.allZonesNames.findIndex(zn => zn === this.zone.name) !== -1) {
      this.toastr.warning(`Zone with name ${this.zone.name} already exists!`);
      return;
    }

    this.genericService.post('/zone/add', {'name': this.zone.name}).subscribe(() => {
      this.toastr.success('Zone successfully added');
      this.router.navigate(['transport/zone']);
      }, error => {
                console.log(JSON.stringify(error));
                this.toastr.error(error.error.error);
    });
  }

}
