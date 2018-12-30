import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Zone} from '../../../../model/zone';
import {HelperMethodsService} from '../../../../services/generic/helper-methods.service';
import {GenericService} from '../../../../services/generic/generic.service';
import {CompleteLine} from '../../../../model/complete-line';
import {Line} from '../../../../model/line';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.css']
})
export class AddZoneComponent implements OnInit {
  removeButtonSign: string = 'x';
  addButtonSign: string = '+';
  zone: Zone;
  zoneLines: CompleteLine[] = [];
  zoneLinesView: CompleteLine[][] = [];
  remainingLines: CompleteLine[] = [];
  remainingLinesView: CompleteLine[][] = [];
  allZonesNames: string[];

  constructor(private genericService: GenericService,
              private helperMethodService: HelperMethodsService) { }

  ngOnInit() {
    this.zone = { id: 0, name: '' };
    this.genericService.getAll<Line>('/line/all').subscribe(lines => {
      this.genericService.getAll<Zone>('/zone/all').subscribe(zones => {
        this.allZonesNames = [];
        this.remainingLines = this.helperMethodService.getCompleteLinesFromLines(lines);
        for (const zone of zones) {
          this.allZonesNames.push(zone.name);
          this.genericService.getListById<Line>('/zone/line', zone.id).subscribe(zoneLines => {
            const completeZoneLines: CompleteLine[] = this.helperMethodService.getCompleteLinesFromLines(zoneLines);
            for (const zoneLine of completeZoneLines) {
              const zoneIndex: number = this.remainingLines.findIndex(l => l.name === zoneLine.name);
              this.remainingLines.splice(zoneIndex, 1);
            }
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
    if (this.allZonesNames.findIndex(zn => zn === this.zone.name) !== -1) {
      alert(`Zone with name ${this.zone.name} already exists!`);
      return;
    }

    this.genericService.post('/zone/add', { 'name': this.zone.name});
  }

}
