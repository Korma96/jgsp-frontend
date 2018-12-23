import {GoogleMapsAPIWrapper} from '@agm/core/services/google-maps-api-wrapper';
import { Component, OnInit, Input} from '@angular/core';
import { Stop } from '../model/stop';
import { Line } from '../model/line';
import { GenericService } from 'src/app/services/generic/generic.service';

declare var google: any;



@Component({
  selector: 'app-directions-map',
  templateUrl: './directions-map.component.html',
  styleUrls: ['./directions-map.component.css']
})
export class DirectionsMapComponent implements OnInit {
  @Input() lineForShowing: Line;

  stops: Stop[];

  parts: any[];

  directionsService: any;
  directionsDisplay: any;

  private relativeUrl: string;

  constructor (private gmapsApi: GoogleMapsAPIWrapper, private stopService: GenericService<Stop>) {
    this.relativeUrl = `/line/${this.lineForShowing.id}/stop`;
  }

  ngOnInit() {
      this.getStops();

      this.gmapsApi.getNativeMap().then(map => {
          this.directionsService = new google.maps.DirectionsService;
          this.directionsDisplay = new google.maps.DirectionsRenderer({
              suppressMarkers: true,  // potisni ugradjene markere (markere koji pripadaju directionsService-u),
                                      // jer cemo postaviti svoje markere za stops
              preserveViewport: true,
              draggable: true,
              map: map // ,
              // markerOptions: {icon: 'file:///E:/STUDIRANJE/CETVRTA%20GODINA/NAPREDNE%20WEB%20TEHNOLOGIJE/Projekat/bus_station.png'}
          });

          this.show(map);

      });
  }

  getStops() {
    this.stopService.getAll(this.relativeUrl) .subscribe(
      stops => this.stops = stops,
      error => alert('Error: ' + JSON.stringify(error))
    );
  }

  show(map: any) {
    // Zoom and center map automatically by stations (each station will be in visible map area)
    const lngs = this.stops.map(stop => stop.longitude);
    const lats = this.stops.map(stop => stop.latitude);
    map.fitBounds({
      west: Math.min.apply(null, lngs),
      east: Math.max.apply(null, lngs),
      north: Math.min.apply(null, lats),
      south: Math.max.apply(null, lats),
    });
  
    // Divide route to several parts because max stations limit is 25 (23 waypoints + 1 origin + 1 destination)
    this.parts = [];
    const max = 25 - 1;
    for (let i = 0; i < this.stops.length; i = i + max) {
      this.parts.push(this.stops.slice(i, i + max + 1));
    }
    
    this.drawLine();
    this.drawStops(map);
  }

  drawLine(): void {
    for (let i = 0; i < this.parts.length; i++) {
      // Waypoints does not include first station (origin) and last station (destination)
      const waypoints = [];
      for (let j = 1; j < this.parts[i].length - 1; j++) {
        waypoints.push({location: this.parts[i][j], stopover: true});
      }

      // Service options
      const service_options = {
        origin: this.parts[i][0],
        destination: this.parts[i][this.parts[i].length - 1],
        waypoints: waypoints,
        travelMode: 'DRIVING',
        provideRouteAlternatives: false
      };
      // Send request
      this.directionsService.route(service_options, this.service_callback);
    }
            
  }

  service_callback(response: any, status: string): void {
    if (status !== 'OK') {
      alert('Directions request failed due to ' + status);
      return;
    }
    /*var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    directionsDisplay.setOptions({ suppressMarkers: true, preserveViewport: true });*/
    this.directionsDisplay.setDirections(response);
  }
  
  drawStops(map: any) {
    let firstStopImage: any = {
      url: '/assets/icons/a.svg',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    let lastStopImage: any = {
      url: '/assets/icons/b.svg',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    
    if (this.lineForShowing.name.includes('B')) {
      const tmp = firstStopImage;
      firstStopImage = lastStopImage;
      lastStopImage = tmp;
      
    }
    
    const otherImage: any = {
      url: '/assets/icons/bus_station.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    
    // Show stations on the map as markers
    for (let i = 0; i < this.stops.length; i++) {
      let image;
      if (i === 0) {
        image = firstStopImage;
      } 
      else if (i === this.stops.length - 1) {
        image = lastStopImage;
      }
      else {
        image = otherImage;
      }

      new google.maps.Marker({
        position: {lat: this.stops[i].latitude, lng: this.stops[i].longitude},
        icon: image,
        map: map,
        title: this.stops[i].name
      });
    }

  }

}
