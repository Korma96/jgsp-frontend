import {Component, OnInit, ViewChild} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Stop} from '../../../model/stop';
import {Action} from '../helpers/enum/action';
import {TransportAdminMapComponent} from '../transport-admin-map/transport-admin-map.component';
import {GenericService} from '../../../services/generic/generic.service';
import {StopService} from '../../../services/transport-admin-services/stop-service/stop.service';

@Component({
  selector: 'app-stop-page',
  templateUrl: './stop-page.component.html',
  styleUrls: ['./stop-page.component.css']
})
export class StopPageComponent implements OnInit {
  center: any = {lat: 45.257136, lng: 19.825549};
  isNameInputDisabled: boolean;
  actionDescription: string;
  actionDescriptionAppendix: string;
  currentAction: Action;
  selectedStop: Stop;
  temporaryStop: Stop;
  @ViewChild(TransportAdminMapComponent)
  mapComponent: TransportAdminMapComponent;

  constructor(private toastr: ToastrService,
              private genericService: GenericService,
              private stopService: StopService) {
  }

  ngOnInit() {
    this.changeAction(Action.ADD);
  }

  actionChanged(event: any) {
    this.changeAction(event.target.value);
  }

  changeAction(action: Action) {
    this.currentAction = action;
    this.updateView();
    this.updateActionDescription();
  }

  doAction() {
    switch (this.currentAction) {
      case Action.ADD:
        if (this.selectedStop.name.trim() === '') {
          this.toastr.warning('Stop name can not be empty or whitespace');
          return;
        }
        this.stopService.add(this.selectedStop).subscribe(() => {
          this.mapComponent.refreshMap();
          this.selectedStop = this.getEmptyStop();
          this.toastr.success('Stop successfully added');
        }, error => {
          console.log(JSON.stringify(error));
        });
        break;
      case Action.UPDATE:
        this.stopService.rename(this.selectedStop).subscribe(() => {
          if (this.selectedStop.latitude !== this.temporaryStop.latitude ||
              this.selectedStop.longitude !== this.temporaryStop.longitude) {
            this.stopService.changeCoordinates(this.selectedStop).subscribe(() => {
              this.doUpdate();
            }, error => {
              console.log(JSON.stringify(error));
            });
          }
          else {
            this.doUpdate();
          }
        }, error => {
          console.log(JSON.stringify(error));
        });
        break;
      case Action.DELETE:
        this.genericService.delete('/stop', this.selectedStop.id).subscribe(() => {
          this.mapComponent.removeStop(this.selectedStop);
          this.selectedStop = this.getEmptyStop();
          this.toastr.success('Stop successfully deleted');
        }, error => {
          console.log(JSON.stringify(error));
        });
        break;
    }
  }

  doUpdate() {
    this.mapComponent.updateMarker(this.selectedStop);
    this.selectedStop = this.getEmptyStop();
    this.temporaryStop = null;
    this.toastr.success('Stop successfully updated');
  }

  getEmptyStop(): Stop {
    return {'id': NaN, 'name': '', 'latitude': NaN, 'longitude': NaN};
  }

  getLatLng(latLng: any) {
    switch (this.currentAction) {
      case Action.ADD:
        this.selectedStop = {'id': NaN, 'name': '',
          'latitude': latLng.lat(), 'longitude': latLng.lng()};
        this.isNameInputDisabled = false;
        break;
      case Action.UPDATE:
      case Action.DELETE:
        break;
    }
  }

  getSelectedStop(stop: Stop): void {
    switch (this.currentAction) {
      case Action.ADD:
        break;
      case Action.UPDATE:
        this.isNameInputDisabled = false;
        this.selectedStop = stop;
        if (this.temporaryStop == null) {
          this.temporaryStop = this.getStopCopy(stop);
        } else {
          if (this.temporaryStop.id !== stop.id) {
            this.temporaryStop = this.getStopCopy(stop);
          }
        }
        break;
      case Action.DELETE:
        this.selectedStop = stop;
        break;
    }
  }

  getStopCopy(stop: Stop): Stop {
    return {
      'id': stop.id,
      'name': stop.name,
      'latitude': stop.latitude,
      'longitude': stop.longitude
    };
  }

  updateActionDescription() {
    switch (this.currentAction) {
      case Action.ADD:
        this.actionDescription = 'Click on map where to add';
        this.actionDescriptionAppendix = 'new stop';
        break;
      case Action.UPDATE:
        this.actionDescription = 'Select stop, changes';
        this.actionDescriptionAppendix = 'are permanently applied';
        break;
      case Action.DELETE:
        this.actionDescription = 'Select stop to delete';
        this.actionDescriptionAppendix = '';
        break;
    }
  }

  updateView() {
    this.temporaryStop = null;
    if (this.mapComponent) {
      this.mapComponent.removeTemporaryMarker();
    }
    this.selectedStop = this.getEmptyStop();
    switch (this.currentAction) {
      case Action.ADD:
        break;
      case Action.UPDATE:
        break;
      case Action.DELETE:
        this.isNameInputDisabled = true;
    }
  }
}
