import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LineForShowing} from '../../../../model/line-for-showing';
import {TransportAdminLineMapComponent} from '../../transport-admin-line-map/transport-admin-line-map.component';
import {Line} from '../../../../model/line';
import {LineAndChecked} from '../../../../model/line-and-checked';
import {CompleteLine} from '../../../../model/complete-line';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {LineService} from '../../../../services/transport-admin-services/line-service/line.service';
import {Action} from '../../helpers/enum/action';
import {Stop} from '../../../../model/stop';
import {GenericService} from '../../../../services/generic/generic.service';
import {Point} from '../../../../model/point';
import {Entity} from '../../helpers/enum/entity';

@Component({
  selector: 'app-update-line',
  templateUrl: './update-line.component.html',
  styleUrls: ['./update-line.component.css']
})
export class UpdateLineComponent implements OnInit {
  center: any = {lat: 45.257136, lng: 19.825549};
  lineName: string;
  isChecked: boolean;
  areLinePointsShown: boolean;
  @Input() completeLine: CompleteLine;
  @Input() directionA: Line;
  @Input() directionB: Line;
  lineForShowingA: LineForShowing;
  lineForShowingB: LineForShowing;
  lineAndCheckedA: LineAndChecked;
  lineAndCheckedB: LineAndChecked;
  latitude: number;
  longitude: number;
  @Output() renameLineEventHandler: EventEmitter<string> = new EventEmitter<string>();
  currentAction: Action;
  currentEntity: Entity;
  selectedStop: Stop;
  selectedPoint: Point;
  possibleNewPoint: Point;
  newLineStopOrdinaryNumber: number;
  @ViewChild(TransportAdminLineMapComponent)
  mapComponent: TransportAdminLineMapComponent;

  constructor(private router: Router,
              private toastr: ToastrService,
              private lineService: LineService,
              private genericService: GenericService) {}

  ngOnInit() {
    this.isChecked = false;
    this.areLinePointsShown = false;
    this.lineName = this.completeLine.name;
    this.lineAndCheckedA = {'line': this.directionA, 'checked': false};
    this.lineAndCheckedB = {'line': this.directionB, 'checked': false};
    this.lineForShowingA = {
      name: this.directionA.name,
      points: [],
      stops: [],
      polyline: null,
      markers: [],
      relativeUrl: '',
      color: null,
      markersForVehicles: [],
      subscription: null
    };
    this.lineForShowingB = {
      name: this.directionB.name,
      points: [],
      stops: [],
      polyline: null,
      markers: [],
      relativeUrl: '',
      color: null,
      markersForVehicles: [],
      subscription: null
    };
    this.changeAction(Action.ADD);
    this.changeEntity(Entity.STOP);
  }

  mapReady() {
    this.mapComponent.lineForShowingA = this.lineForShowingA;
    this.mapComponent.lineForShowingB = this.lineForShowingB;
    this.directionAClick();
  }

  directionAClick() {
    this.changeAction(Action.ADD);
    this.mapComponent.currentLineForShowing = this.lineForShowingA;
    document.getElementById('directiona_button').className = 'active_button';
    document.getElementById('directionb_button').className = 'not_active_button';
    this.lineAndCheckedA.checked = true;
    this.mapComponent.showCheckedLine(this.lineAndCheckedA, this.lineForShowingA);
    this.lineAndCheckedB.checked = false;
    this.mapComponent.showCheckedLine(this.lineAndCheckedB, this.lineForShowingB);
  }

  directionBClick() {
    this.changeAction(Action.ADD);
    this.mapComponent.currentLineForShowing = this.lineForShowingB;
    document.getElementById('directionb_button').className = 'active_button';
    document.getElementById('directiona_button').className = 'not_active_button';
    this.lineAndCheckedB.checked = true;
    this.mapComponent.showCheckedLine(this.lineAndCheckedB, this.lineForShowingB);
    this.lineAndCheckedA.checked = false;
    this.mapComponent.showCheckedLine(this.lineAndCheckedA, this.lineForShowingA);
  }

  renameLine() {
    this.renameLineEventHandler.next(this.lineName);
  }

  showAllStops() {
    this.isChecked = !this.isChecked;
    this.mapComponent.showOrHideOtherStops(this.isChecked);
  }

  showLinePoints() {
    this.areLinePointsShown = !this.areLinePointsShown;
    if (this.lineAndCheckedA.checked) {
      this.mapComponent.showOrHideLinePoints(this.lineForShowingA, this.areLinePointsShown);
    } else {
      this.mapComponent.showOrHideLinePoints(this.lineForShowingB, this.areLinePointsShown);
    }
  }

  actionChanged(event: any) {
    this.changeAction(event.target.value);
  }

  entityChanged(event: any) {
    this.changeEntity(event.target.value);
  }

  changeAction(action: Action) {
    this.currentAction = action;
    this.updateView();
  }

  changeEntity(entity: Entity) {
    this.currentEntity = entity;
    this.updateView();
  }

  getEmptyStop(): Stop {
    return {'id': NaN, 'name': '', 'latitude': NaN, 'longitude': NaN};
  }

  getEmptyPoint(): Point {
    return {'lat': NaN, 'lng': NaN};
  }

  selectedStopEventHandler(stop: Stop) {
    if (this.currentAction === Action.ADD) {
      if (this.lineAndCheckedA) {
        if (this.lineForShowingA.stops.findIndex(s => s.id === stop.id) === -1) {
          this.selectedStop = stop;
          this.latitude = stop.latitude;
          this.longitude = stop.longitude;
        }
      } else {
        if (this.lineForShowingB.stops.findIndex(s => s.id === stop.id) === -1) {
          this.selectedStop = stop;
          this.latitude = stop.latitude;
          this.longitude = stop.longitude;
        }
      }
    }
    if (this.currentAction === Action.DELETE) {
      if (this.lineAndCheckedA) {
        if (this.lineForShowingA.stops.findIndex(s => s.id === stop.id) !== -1) {
          this.selectedStop = stop;
          this.latitude = stop.latitude;
          this.longitude = stop.longitude;
        }
      } else {
        if (this.lineForShowingB.stops.findIndex(s => s.id === stop.id) !== -1) {
          this.selectedStop = stop;
          this.latitude = stop.latitude;
          this.longitude = stop.longitude;
        }
      }
    }
  }

  selectedPointEventHandler(point: Point) {
    this.latitude = point.lat;
    this.longitude = point.lng;
    this.selectedPoint = point;
  }

  getNewPointEventHandler(latLng: any) {
    this.possibleNewPoint = {'lat': latLng.lat(), 'lng': latLng.lng()};
    this.selectedPoint = this.possibleNewPoint;
    this.latitude = latLng.lat();
    this.longitude = latLng.lng();
  }

  doAction() {
    let lineId: number = NaN;
    if (this.lineAndCheckedA.checked) {
      lineId = this.lineAndCheckedA.line.id;
    } else {
      lineId = this.lineAndCheckedB.line.id;
    }
    switch (this.currentEntity) {
      case Entity.STOP:
        if (isNaN(this.selectedStop.id)) {
          return;
        }
        switch (this.currentAction) {
          case Action.ADD:
            let maxOrdNum = 1;
            if (this.lineAndCheckedA.checked) {
              maxOrdNum = this.lineForShowingA.stops.length + 1;
            } else {
              maxOrdNum = this.lineForShowingB.stops.length + 1;
            }
            if (this.newLineStopOrdinaryNumber < 1 || this.newLineStopOrdinaryNumber > maxOrdNum) {
              this.toastr.error(`Ordinary number out of bounds!\nIt must be between 1 and ${this.lineForShowingA.stops.length + 1}`);
              return;
            }
            this.genericService.post('/line/stop/add',
              {'lineId': lineId, 'stopId': this.selectedStop.id, 'position': this.newLineStopOrdinaryNumber}).subscribe(() => {
              if (this.lineAndCheckedA.checked) {
                this.mapComponent.addStopToLine(this.lineForShowingA, this.selectedStop, this.newLineStopOrdinaryNumber);
              } else {
                this.mapComponent.addStopToLine(this.lineForShowingB, this.selectedStop, this.newLineStopOrdinaryNumber);
              }
              this.updateView();
              this.toastr.success('Stop successfully added to line');
            }, error => {
              console.log(JSON.stringify(error));
            });
            break;
          case Action.DELETE:
            this.genericService.post('/line/stop/remove',
              {'lineId': lineId, 'stopId': this.selectedStop.id}).subscribe(() => {
              if (this.lineAndCheckedA.checked) {
                this.mapComponent.removeStopFromLine(this.lineForShowingA, this.selectedStop);
              } else {
                this.mapComponent.removeStopFromLine(this.lineForShowingB, this.selectedStop);
              }
              this.updateView();
              this.toastr.success('Stop successfully removed from line');
            }, error => {
              console.log(JSON.stringify(error));
            });
            break;
        }
        break;
      case Entity.POINT:
        if (isNaN(this.selectedPoint.lat)) {
          return;
        }
        switch (this.currentAction) {
          case Action.ADD:
            if (this.lineAndCheckedA.checked) {
              this.genericService.post('/line/point/add', {'lineId': this.lineAndCheckedA.line.id,
                'lat': this.possibleNewPoint.lat, 'lng': this.possibleNewPoint.lng,
                'position': this.newLineStopOrdinaryNumber}).subscribe(() => {
                  this.lineForShowingA.points.splice(this.newLineStopOrdinaryNumber - 1, 0, this.possibleNewPoint);
                  this.mapComponent.addNewPoint(this.lineForShowingA, this.newLineStopOrdinaryNumber, this.areLinePointsShown);
                  this.updateView();
                  this.toastr.success('Point successfully added');
              }, error => console.log(JSON.stringify(error)));
            } else {
              this.genericService.post('/line/point/add', {'lineId': this.lineAndCheckedB.line.id,
                'lat': this.possibleNewPoint.lat, 'lng': this.possibleNewPoint.lng,
                'position': this.newLineStopOrdinaryNumber}).subscribe(() => {
                  this.lineForShowingB.points.splice(this.newLineStopOrdinaryNumber - 1, 0, this.possibleNewPoint);
                  this.mapComponent.addNewPoint(this.lineForShowingA, this.newLineStopOrdinaryNumber, this.areLinePointsShown);
                  this.updateView();
                  this.toastr.success('Point successfully added');
              }, error => console.log(JSON.stringify(error)));
            }
            this.toastr.success('Point successfully added');
            break;
          case Action.DELETE:
            if (this.lineAndCheckedA.checked) {
              this.genericService.post('/line/point/remove', {'lineId': this.lineAndCheckedA.line.id,
                'lat': this.selectedPoint.lat, 'lng': this.selectedPoint.lng}).subscribe(() => {
                  const index: number = this.lineForShowingA.points.findIndex(p => p.lat === this.selectedPoint.lat &&
                    p.lng === this.selectedPoint.lng);
                  this.lineForShowingA.points.splice(index, 1);
                  this.mapComponent.removePoint(this.lineForShowingA, index, this.areLinePointsShown);
                  this.toastr.success('Point successfully removed');
                  this.updateView();
              }, error => console.log(JSON.stringify(error)));
            } else {
              this.genericService.post('/line/point/remove', {'lineId': this.lineAndCheckedB.line.id,
                'lat': this.selectedPoint.lat, 'lng': this.selectedPoint.lng}).subscribe(() => {
                  const index: number = this.lineForShowingB.points.findIndex(p => p.lat === this.selectedPoint.lat &&
                    p.lng === this.selectedPoint.lng);
                  this.lineForShowingB.points.splice(index, 1);
                  this.mapComponent.removePoint(this.lineForShowingB, index, this.areLinePointsShown);
                  this.updateView();
                  this.toastr.success('Point successfully removed');
              }, error => console.log(JSON.stringify(error)));
            }
            break;
        }
        break;
    }
  }

  updateView() {
    this.selectedStop = this.getEmptyStop();
    this.selectedPoint = this.getEmptyPoint();
    this.possibleNewPoint = this.getEmptyPoint();
    this.latitude = NaN;
    this.longitude = NaN;
    this.mapComponent.removeTemporaryMarker();
    switch (this.currentAction) {
      case Action.ADD:
        this.newLineStopOrdinaryNumber = 1;
        break;
      case Action.DELETE:
        break;
    }
    switch (this.currentEntity) {
      case Entity.POINT:
        break;
      case Entity.STOP:
        break;
    }
  }
}
