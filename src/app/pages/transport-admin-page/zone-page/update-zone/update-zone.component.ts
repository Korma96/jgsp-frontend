import { Component, OnInit } from '@angular/core';
import {Zone} from '../../../../model/zone';
import {CompleteLine} from '../../../../model/complete-line';
import {GenericService} from '../../../../services/generic/generic.service';
import {HelperMethodsService} from '../../../../services/generic/helper-methods.service';
import {Line} from '../../../../model/line';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-update-zone',
  templateUrl: './update-zone.component.html',
  styleUrls: ['./update-zone.component.css']
})
export class UpdateZoneComponent implements OnInit {
  removeButtonSign: string = 'x';
  addButtonSign: string = '+';
  zone: Zone;
  oldZoneName: string;
  zoneLines: CompleteLine[] = [];
  zoneLinesView: CompleteLine[][] = [];
  remainingLines: CompleteLine[] = [];
  remainingLinesView: CompleteLine[][] = [];
  allZonesNames: string[];

  constructor(private genericService: GenericService,
              private helperMethodService: HelperMethodsService,
              private route: ActivatedRoute,
              private router: Router) { }

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
          console.log(this.remainingLines.length);
          for (const zone of zones) {
            this.allZonesNames.push(zone.name);
            this.genericService.getListById<Line>('/zone/line', zone.id).subscribe(zoneLines => {
              const completeZoneLines: CompleteLine[] = this.helperMethodService.getCompleteLinesFromLines(zoneLines);
              if (zone.id === this.zone.id) {
                this.zoneLines = completeZoneLines;
                this.zoneLines.sort(this.helperMethodService.compare);
                this.updateZoneLinesView();
              }
              for (const zoneLine of completeZoneLines) {
                const zoneIndex: number = this.remainingLines.findIndex(l => l.name === zoneLine.name);
                this.remainingLines.splice(zoneIndex, 1);
              }
              this.remainingLines.sort(this.helperMethodService.compare);
              this.updateRemainingLinesView();
            });
          }
      });
    });
  }

  removeLineFromZone(completeLineName: string) {
    const index: number = this.zoneLines.findIndex(x => x.name === completeLineName);
    const line: CompleteLine = this.zoneLines[index];

    this.zoneLines.splice(index, 1);
    this.remainingLines.push(line);

    this.genericService.post('/zone/line/remove', {'zoneId': this.zone.id, 'lineId': line.aLineId});
    this.genericService.post('/zone/line/remove', {'zoneId': this.zone.id, 'lineId': line.bLineId});

    this.updateZoneLinesView();
    this.updateRemainingLinesView();
  }

  addLineToZone(completeLineName: string) {
    const index: number = this.remainingLines.findIndex(x => x.name === completeLineName);
    const line: CompleteLine = this.remainingLines[index];

    this.remainingLines.splice(index, 1);
    this.zoneLines.push(line);

    this.genericService.post('/zone/line/add', {'zoneId': this.zone.id, 'lineId': line.aLineId});
    this.genericService.post('/zone/line/add', {'zoneId': this.zone.id, 'lineId': line.bLineId});

    this.updateZoneLinesView();
    this.updateRemainingLinesView();
  }

  updateZoneLinesView() {
    this.zoneLinesView = this.helperMethodService.getListOfLists<CompleteLine>(5, this.zoneLines);
  }

  updateRemainingLinesView() {
    this.remainingLinesView = this.helperMethodService.getListOfLists<CompleteLine>(5, this.remainingLines);
  }

  save() {
    if (this.zone.name.trim() === '') {
      alert('Zone name can`t be empty or whitespace!');
      return;
    }
    if (this.oldZoneName !== this.zone.name) {
      if (this.allZonesNames.findIndex(zn => zn === this.zone.name) !== -1) {
        alert(`Zone with name ${this.zone.name} already exists!`);
        return;
      }
    }

    this.genericService.post('/zone/rename', this.zone);
  }
}
