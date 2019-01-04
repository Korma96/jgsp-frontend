import { Component, OnInit } from '@angular/core';
import {Zone} from '../../../../model/zone';
import {CompleteLine} from '../../../../model/complete-line';
import {GenericService} from '../../../../services/generic/generic.service';
import {HelperMethodsService} from '../../../../services/generic/helper-methods.service';
import {Line} from '../../../../model/line';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ZoneService} from '../../../../services/transport-admin-services/zone-service/zone.service';

@Component({
  selector: 'app-update-zone',
  templateUrl: './update-zone.component.html',
  styleUrls: ['./update-zone.component.css']
})
export class UpdateZoneComponent implements OnInit {
  removeButtonSign: string = 'x';
  addButtonSign: string = '+';
  elemsPerRow: number = 5;
  zone: Zone = {id: 0, name: ''};
  oldZoneName: string;
  zoneLines: CompleteLine[] = [];
  zoneLinesView: CompleteLine[][] = [];
  remainingLines: CompleteLine[] = [];
  remainingLinesView: CompleteLine[][] = [];
  allZonesNames: string[];

  constructor(private genericService: GenericService,
              private helperMethodService: HelperMethodsService,
              private zoneService: ZoneService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    let zoneId: number = -1;
    this.route.params.subscribe(res => zoneId = res.id);
    this.genericService.getAll<Zone>('/zone/all').subscribe(zones => {
      this.zone = zones.find(z => z.id === +zoneId);
      if (this.zone == null) {
        alert(`Zone with id ${zoneId} doesn't exist!`);
        this.router.navigate(['transport/zone']);
      }
      this.oldZoneName = this.zone.name;
      this.genericService.getAll<Line>('/line/all').subscribe(lines => {
          this.allZonesNames = [];
          this.remainingLines = this.helperMethodService.getCompleteLinesFromLines(lines);
          for (const zone of zones) {
            this.allZonesNames.push(zone.name);

            (function (id: number, that: UpdateZoneComponent) {
              that.zoneService.getLines(id).subscribe(zoneLines => {
                const completeZoneLines: CompleteLine[] = that.helperMethodService.getCompleteLinesFromLines(zoneLines);
                if (id === that.zone.id) {
                  that.zoneLines = completeZoneLines;
                  that.updateZoneLinesView();
                }
                for (const zoneLine of completeZoneLines) {
                  const zoneIndex: number = that.remainingLines.findIndex(l => l.name === zoneLine.name);
                  that.remainingLines.splice(zoneIndex, 1);
                }
                that.updateRemainingLinesView();
              }, error => {
                console.log(JSON.stringify(error));
                that.toastr.error(error.error.error);
              });
            })(zone.id, this);

          }
      });
    });
  }

  removeLineFromZone(completeLineName: string) {
    const index: number = this.zoneLines.findIndex(x => x.name === completeLineName);
    const line: CompleteLine = this.zoneLines[index];

    this.genericService.post('/zone/line/remove', {'zoneId': this.zone.id, 'lineId': line.aLineId}).subscribe(() => {
      this.genericService.post('/zone/line/remove', {'zoneId': this.zone.id, 'lineId': line.bLineId}).subscribe(() => {
        this.zoneLines.splice(index, 1);
        this.remainingLines.push(line);
        this.updateZoneLinesView();
        this.updateRemainingLinesView();
        this.toastr.success('Line successfully removed');
      }, error => {
        console.log(JSON.stringify(error));
        this.toastr.error(error.error.error);
      });
    }, error => {
      console.log(JSON.stringify(error));
      this.toastr.error(error.error.error);
    });
  }

  addLineToZone(completeLineName: string) {
    const index: number = this.remainingLines.findIndex(x => x.name === completeLineName);
    const line: CompleteLine = this.remainingLines[index];

    this.genericService.post('/zone/line/add', {'zoneId': this.zone.id, 'lineId': line.aLineId}).subscribe(() => {
      this.genericService.post('/zone/line/add', {'zoneId': this.zone.id, 'lineId': line.bLineId}).subscribe(() => {
        this.remainingLines.splice(index, 1);
        this.zoneLines.push(line);
        this.updateZoneLinesView();
        this.updateRemainingLinesView();
        this.toastr.success('Line successfully added');
      }, error => {
        console.log(JSON.stringify(error));
        this.toastr.error(error.error.error);
      });
    }, error => {
      console.log(JSON.stringify(error));
      this.toastr.error(error.error.error);
    });
  }

  updateZoneLinesView() {
    this.zoneLines.sort(this.helperMethodService.compare);
    this.zoneLinesView = this.helperMethodService.getListOfLists<CompleteLine>(this.elemsPerRow, this.zoneLines);
  }

  updateRemainingLinesView() {
    this.remainingLines.sort(this.helperMethodService.compare);
    this.remainingLinesView = this.helperMethodService.getListOfLists<CompleteLine>(this.elemsPerRow, this.remainingLines);
  }

  save() {
    if (this.zone.name.trim() === '') {
      this.toastr.warning('Zone name can`t be empty or whitespace!');
      return;
    }
    if (this.oldZoneName === this.zone.name) {
      this.toastr.warning('Zone name is still unchanged');
      return;
    }
    else {
      if (this.allZonesNames.findIndex(zn => zn === this.zone.name) !== -1) {
        this.toastr.warning(`Zone with name ${this.zone.name} already exists!`);
        return;
      }
    }

    this.genericService.post('/zone/rename', this.zone).subscribe(() => {
      this.toastr.success('Zone successfully updated');
      this.router.navigate(['transport/zone']);
    }, error => {
      console.log(JSON.stringify(error));
      this.toastr.error(error.error.error);
    });
  }
}
