import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {GoogleMapsAPIWrapper} from '@agm/core/services/google-maps-api-wrapper';
import {StopService} from '../../../services/transport-admin-services/stop-service/stop.service';
import {ToastrService} from 'ngx-toastr';
import {Stop} from '../../../model/stop';
import {LineAndChecked} from '../../../model/line-and-checked';
import {LineForShowing} from '../../../model/line-for-showing';
import {PointsAndStops} from '../../../model/points-and-stops';
import {colors} from '../../../resources/colors';
import {GenericService} from '../../../services/generic/generic.service';
import {Action} from '../helpers/enum/action';
import {Entity} from '../helpers/enum/entity';
import {Point} from '../../../model/point';

declare var google: any;

@Component({
  selector: 'app-transport-admin-line-map',
  templateUrl: './transport-admin-line-map.component.html',
  styleUrls: ['./transport-admin-line-map.component.css']
})
export class TransportAdminLineMapComponent implements OnInit {
  map: any;
  stops: Stop[];
  colors: string[];
  otherMarkers: any[];
  @Input() currentAction: Action;
  @Input() currentEntity: Entity;
  currentLineForShowing: LineForShowing;
  lineForShowingA: LineForShowing;
  lineForShowingB: LineForShowing;
  lineAPointsMarkers: any[];
  lineBPointsMarkers: any[];
  @Output() mapReadyEventHandler: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() stopEmitter: EventEmitter<Stop> = new EventEmitter<Stop>();
  @Output() latLngEmitter: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() pointEmitter: EventEmitter<Point> = new EventEmitter<Point>();
  firstStopImage: any = { url: '/assets/icons/a.svg' };
  lastStopImage: any = { url: '/assets/icons/b.svg' };
  blueStopImage: any = { url: '/assets/icons/bus_station_blue.png' };
  redStopImage: any = { url: '/assets/icons/bus_station_red.png' };
  pointImage: any = { url: '/assets/icons/point.png' };
  temporaryAddMarker: any;
  alreadyShowedStopsIds: number[];
  otherStopsShowed: boolean = false;

  constructor(@Inject('BASE_API_URL') baseUrl: string,
              private gmapsApi: GoogleMapsAPIWrapper,
              private toastr: ToastrService,
              private genericService: GenericService,
              private stopService: StopService) {
      this.gmapsApi = gmapsApi;
      this.colors = colors;
      this.otherMarkers = [];
      this.lineAPointsMarkers = [];
      this.lineBPointsMarkers = [];
  }

  ngOnInit() {
    this.gmapsApi.getNativeMap().then(map => {
      this.map = map;
      this.addMapClickListener(this, map);
      this.stopService.getAll().subscribe(stops => {
        this.stops = stops;
        for (const stop of this.stops) {
          this.otherMarkers[stop.id] = this.getMarker(stop, this.blueStopImage);
        }
        this.mapReadyEventHandler.next(true);
      }, error => {
        console.log(JSON.stringify(error));
      });
    });
  }

  addMapClickListener(that: any, map: any) {
    google.maps.event.addListener(map, 'click', function (e) {
      if (that.currentAction === Action.ADD && that.currentEntity === Entity.POINT) {
        that.removeTemporaryMarker();
        that.temporaryAddMarker = that.getPointMarker(e.latLng.lat(), e.latLng.lng(), that.pointImage);
        that.temporaryAddMarker.setMap(map);
        that.latLngEmitter.emit(e.latLng);
      }
    });
  }

  removeTemporaryMarker() {
    if (this.temporaryAddMarker != null && this.temporaryAddMarker.map != null) {
      this.temporaryAddMarker.setMap(null);
    }
  }

  public showCheckedLine(lineAndChecked: LineAndChecked, lineForShowing: LineForShowing) {
    if (lineAndChecked.checked) {
      if (lineForShowing.relativeUrl !== '') {
        this.showLine(lineForShowing);
        this.showLineStops(lineForShowing);
      }
      else {
        lineForShowing.relativeUrl = `/line/${lineAndChecked.line.id}/points-and-stops`;
        lineForShowing.color = this.colors[lineAndChecked.line.id % this.colors.length];

        this.getPointsAndStops(lineForShowing);
      }
    }
    else {
      if (lineForShowing) {
        this.hide(lineForShowing);
      }
      else {
        this.toastr.warning('The completeLine you need to remove can not be found in Google Maps');
      }
    }
  }

  hide(lineForShowing: LineForShowing) {
    this.removeLine(lineForShowing);
    this.removeLineStops(lineForShowing);
  }

  removeLineStops(lineForShowing: LineForShowing) {
    if (lineForShowing.markers) {
      for (const marker of lineForShowing.markers) {
        if (marker != null) {
          marker.setMap(null);
        }
      }
    }
  }

  removeLine(lineForShowing: LineForShowing) {
    if (lineForShowing.polyline != null) {
      lineForShowing.polyline.setMap(null);
    }
  }

  getPointsAndStops(lineForShowing: LineForShowing) {
    this.genericService.get<PointsAndStops>(lineForShowing.relativeUrl) .subscribe(
      pointsAndStops => {
        lineForShowing.points = pointsAndStops.points;
        lineForShowing.stops = pointsAndStops.stops;
        this.showLine(lineForShowing);
        this.showLineStops(lineForShowing);
        this.initializeLinePoints(lineForShowing);
      },
      err => this.toastr.error('Error: ' + JSON.stringify(err))
    );
  }

  showLine(lineForShowing: LineForShowing): void {
    if (!lineForShowing.polyline) {
      const polylineOptions = new google.maps.Polyline({
        path: lineForShowing.points,
        strokeColor: lineForShowing.color,
        strokeWeight: 5,
        strokeOpacity: 1.0
      });

      lineForShowing.polyline = new google.maps.Polyline(polylineOptions);
    }

    lineForShowing.polyline.setMap(this.map);
  }

  showLineStops(lineForShowing: LineForShowing) {
    if (this.otherStopsShowed) {
      if (this.alreadyShowedStopsIds) {
        for (const id of this.alreadyShowedStopsIds) {
          this.otherMarkers[id].setMap(this.map);
        }
      }
    }
    this.alreadyShowedStopsIds = [];
    for (let i = 0; i < lineForShowing.stops.length; i++) {
      if (lineForShowing.markers[i] == null) {
        let image = null;
        if (i === 0) {
          image = this.firstStopImage;
        } else if (i === lineForShowing.stops.length - 1) {
          image = this.lastStopImage;
        } else {
          image = this.redStopImage;
        }
        lineForShowing.markers.push(this.getMarker(lineForShowing.stops[i], image));
      }

      if (this.otherMarkers[lineForShowing.stops[i].id]) {
        // hide marker from other markers if line already contains that marker
        this.otherMarkers[lineForShowing.stops[i].id].setMap(null);
      }

      this.alreadyShowedStopsIds.push(lineForShowing.stops[i].id);
      lineForShowing.markers[i].setMap(this.map);
    }
  }

  getMarker(stop: Stop, image: any): any {
    const that = this;
    const infowindow = new google.maps.InfoWindow({
      content: stop.name
    });

    const marker = new google.maps.Marker({
      position: {lat: stop.latitude, lng: stop.longitude},
      map: null,
      icon: image,
      infowindow: stop.name
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(that.map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
    });

    google.maps.event.addListener(marker, 'click', function() {
      that.stopEmitter.emit(stop);
    });

    return marker;
  }

  getPointMarker(lat: number, lng: number, image: any): any {
    const that = this;
    const marker = new google.maps.Marker({
      position: {lat: lat, lng: lng},
      map: null
    });
    marker.setIcon(image);
    google.maps.event.addListener(marker, 'click', function() {
      if (that.currentAction === Action.DELETE && that.currentEntity === Entity.POINT) {
        that.pointEmitter.emit({'lat': lat, 'lng': lng});
      }
    });

    return marker;
  }

  showOrHideOtherStops(isChecked: boolean) {
    this.otherStopsShowed = isChecked;
    let map = null;
    if (isChecked) {
      map = this.map;
    }

    for (const stop of this.stops) {
      if (this.alreadyShowedStopsIds) {
        if (map) {
          if (this.alreadyShowedStopsIds.findIndex(id => stop.id === id) !== -1) {
            this.otherMarkers[stop.id].setMap(null);
            continue;
          }
        }
      }

      this.otherMarkers[stop.id].setMap(map);
    }
  }

  removeStopFromLine(lineForShowing: LineForShowing, selectedStop: Stop) {
    const index: number = lineForShowing.stops.findIndex(s => s.id === selectedStop.id);
    // removing stop
    lineForShowing.stops.splice(index, 1);
    // adding stop
    this.stops.push(selectedStop);
    const marker: any = lineForShowing.markers[index];
    if (index === (lineForShowing.markers.length - 1) && lineForShowing.markers.length >= 3) {
      lineForShowing.markers[lineForShowing.markers.length - 2].setIcon(this.lastStopImage);
    } else if (index === 0 && lineForShowing.markers.length >= 3) {
      lineForShowing.markers[1].setIcon(this.firstStopImage);
    }
    marker.setIcon(this.blueStopImage);
    // removing marker
    lineForShowing.markers.splice(index, 1);
    // adding marker
    this.otherMarkers[selectedStop.id] = marker;
    // refresh line
    lineForShowing.polyline = null;
    this.showLine(lineForShowing);
  }

  addStopToLine(lineForShowing: LineForShowing, selectedStop: Stop, newLineStopOrdinaryNumber: number) {
    const index: number = this.stops.findIndex(s => s.id === selectedStop.id);
    // removing stop
    this.stops.splice(index, 1);
    // inserting stop
    lineForShowing.stops.splice(newLineStopOrdinaryNumber - 1, 0, selectedStop);
    // update marker color
    const marker: any = this.otherMarkers[selectedStop.id];
    if (newLineStopOrdinaryNumber === 1) {
      marker.setIcon(this.firstStopImage);
      if (lineForShowing.stops.length >= 2) {
        lineForShowing.markers[0].setIcon(this.redStopImage);
      }
    } else if (newLineStopOrdinaryNumber === lineForShowing.stops.length + 1) {
      marker.setIcon(this.lastStopImage);
      if (lineForShowing.stops.length > 2) {
        lineForShowing.markers[lineForShowing.markers.length - 2].setIcon(this.redStopImage);
      }
    } else if (newLineStopOrdinaryNumber === lineForShowing.stops.length) {
      marker.setIcon(this.lastStopImage);
      if (lineForShowing.stops.length > 2) {
        lineForShowing.markers[lineForShowing.markers.length - 1].setIcon(this.redStopImage);
      }
    } else {
      marker.setIcon(this.redStopImage);
    }
    // removing marker
    this.otherMarkers[selectedStop.id] = null;
    // inserting marker
    lineForShowing.markers.splice(newLineStopOrdinaryNumber - 1, 0, marker);
    // refresh line
    lineForShowing.polyline = null;
    this.showLine(lineForShowing);
  }

  showOrHideLinePoints(lineForShowing: LineForShowing, areLinePointsShown: boolean) {
    this.lineAPointsMarkers.forEach(m => m.setMap(null));
    this.lineBPointsMarkers.forEach(m => m.setMap(null));
    if (areLinePointsShown) {
      if (lineForShowing.name === this.lineForShowingA.name) {
        this.lineAPointsMarkers.forEach(m => m.setMap(this.map));
      }
      else {
        this.lineBPointsMarkers.forEach(m => m.setMap(this.map));
      }
    }
  }

  refreshLine(lineForShowing: LineForShowing) {
    lineForShowing.polyline.setMap(null);
    lineForShowing.polyline = null;
    this.showLine(lineForShowing);
  }

  addNewPoint(lineForShowing: LineForShowing, newLineStopOrdinaryNumber: number, arePointsShown: boolean) {
    if (lineForShowing.name === this.lineForShowingA.name) {
      this.lineAPointsMarkers.splice(newLineStopOrdinaryNumber - 1, 0, this.temporaryAddMarker);
    } else {
      this.lineBPointsMarkers.splice(newLineStopOrdinaryNumber - 1, 0, this.temporaryAddMarker);
    }
    this.showOrHideLinePoints(lineForShowing, arePointsShown);
    this.refreshLine(lineForShowing);
  }

  initializeLinePoints(lineForShowing: LineForShowing) {
    if (lineForShowing.name === this.lineForShowingA.name) {
      this.lineForShowingA.points.forEach(p =>
        this.lineAPointsMarkers.push(this.getPointMarker(p.lat, p.lng, this.pointImage)));
    } else {
      this.lineForShowingB.points.forEach(p =>
        this.lineBPointsMarkers.push(this.getPointMarker(p.lat, p.lng, this.pointImage)));
    }
  }

  removePoint(lineForShowing: LineForShowing, index: number, arePointsShown: boolean) {
    if (lineForShowing.name === this.lineForShowingA.name) {
      this.lineAPointsMarkers[index].setMap(null);
      this.lineAPointsMarkers.splice(index, 1);
    } else {
      this.lineBPointsMarkers[index].setMap(null);
      this.lineBPointsMarkers.splice(index, 1);
    }
    this.showOrHideLinePoints(lineForShowing, arePointsShown);
    this.refreshLine(lineForShowing);
  }
}
