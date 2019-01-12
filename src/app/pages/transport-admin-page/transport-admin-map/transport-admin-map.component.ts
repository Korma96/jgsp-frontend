import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stop} from '../../../model/stop';
import {GoogleMapsAPIWrapper} from '@agm/core';
import {Action} from '../helpers/enum/action';
import {StopService} from '../../../services/transport-admin-services/stop-service/stop.service';

declare var google: any;

@Component({
  selector: 'app-transport-admin-map',
  templateUrl: './transport-admin-map.component.html',
  styleUrls: ['./transport-admin-map.component.css']
})
export class TransportAdminMapComponent implements OnInit {
  @Input() currentAction: Action;
  stops: Stop[];
  markers: any[];
  temporaryAddMarker: any = {};
  @Output() stopEmitter: EventEmitter<Stop> = new EventEmitter<Stop>();
  @Output() latLngEmitter: EventEmitter<Object> = new EventEmitter<Object>();
  map: any;

  constructor(private gmapsApi: GoogleMapsAPIWrapper, private stopService: StopService) { }

  ngOnInit() {
    this.refreshMap();
  }

  addMapClickListener(that: any, map: any) {
    google.maps.event.addListener(map, 'click', function (e) {
      if (that.currentAction === Action.ADD) {
        that.removeTemporaryMarker();
        const image: any = {
          url: '../../../../assets/icons/bus_station_blue.png',
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        that.temporaryAddMarker = new google.maps.Marker({
          position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
          map: that.map,
          icon: image,
        });
        that.latLngEmitter.emit(e.latLng);
      }
    });
  }

  addMarker(image, stop): any {
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

    google.maps.event.addListener(marker, 'mouseout', function(e) {
      infowindow.close();
      if (that.currentAction === Action.UPDATE) {
        stop.latitude = e.latLng.lat();
        stop.longitude = e.latLng.lng();
        that.stopEmitter.emit(stop);
      }
    });

    google.maps.event.addListener(marker, 'click', function() {
      if (that.currentAction === Action.UPDATE) {
        that.markers[stop.id].setDraggable(true);
      } else {
        that.markers[stop.id].setDraggable(false);
      }

      if (that.currentAction !== Action.ADD) {
        that.stopEmitter.emit(stop);
      }
    });

    return marker;
  }

  createMarker(stop: Stop) {
    const image: any = {
      url: '../../../../assets/icons/bus_station_blue.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    this.markers[stop.id] = this.addMarker(image, stop);
  }

  refreshMap() {
    this.gmapsApi.getNativeMap().then(map => {
      this.map = map;
      const that = this;
      this.removeTemporaryMarker();
      this.addMapClickListener(that, map);
      this.refreshMarkers();
      this.stopService.getAll().subscribe(stops => {
        this.stops = stops;
        for (const stop of this.stops) {
          this.createMarker(stop);
          this.showMarker(stop.id);
        }
      }, error => {
        console.log(JSON.stringify(error));
      });
    }, error => {
      console.log(JSON.stringify(error));
    });
  }

  refreshMarkers() {
    if (this.markers != null) {
      for (const m of this.markers) {
        if (m != null) {
          m.setMap(null);
        }
      }
    }
    this.markers = [];
  }

  removeStop(stop: Stop) {
    this.markers[stop.id].setMap(null);
    this.markers[stop.id] = null;
    this.stops.splice(this.stops.indexOf(stop), 1);
  }

  removeTemporaryMarker() {
    if (this.temporaryAddMarker != null && this.temporaryAddMarker.map != null) {
      this.temporaryAddMarker.setMap(null);
    }
  }

  showMarker(stopId: number) {
    this.markers[stopId].setMap(this.map);
  }

  updateMarker(stop: Stop) {
    this.markers[stop.id].setMap(null);
    this.createMarker(stop);
    this.showMarker(stop.id);
  }
}
