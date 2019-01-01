import {GoogleMapsAPIWrapper} from '@agm/core/services/google-maps-api-wrapper';
import { Component, OnInit, Input} from '@angular/core';
import { Line } from '../model/line';
import { GenericService } from 'src/app/services/generic/generic.service';
import { colors } from '../resources/colors';
import { PointsAndStops } from '../model/points-and-stops';
import { ToastrService } from 'ngx-toastr';
import { LineForShowing } from '../model/line-for-showing';
import { CheckSliderService } from '../services/check-slider/check-slider.service';
import { LineAndChecked } from '../model/line-and-checked';

declare var google: any;



@Component({
  selector: 'app-directions-map',
  templateUrl: './directions-map.component.html',
  styleUrls: ['./directions-map.component.css']
})
export class DirectionsMapComponent implements OnInit {

  colors: string[];

  linesForShowing: LineForShowing[];

  map: any;
  // directionsService: any;
  // directionsDisplay: any;


  constructor (private gmapsApi: GoogleMapsAPIWrapper, 
              private stopService: GenericService,
              private toastr: ToastrService,
              private checkSliderService: CheckSliderService) {
    // this.relativeUrl = '/completeLine/20/stop';
    this.linesForShowing = [];
    this.colors = colors; // importovani colors
  }

  ngOnInit() {
      this.gmapsApi.getNativeMap().then(map => {
          this.map = map;
      });

      this.checkSliderService.change.subscribe(
        (lineAndChecked: LineAndChecked) => {
          if (lineAndChecked.checked) {
              if (this.linesForShowing[lineAndChecked.line.id]) { 
                this.show(this.linesForShowing[lineAndChecked.line.id]);
              }
              else {
                this.linesForShowing[lineAndChecked.line.id] = {
                  name: lineAndChecked.line.name,
                  points: [],
                  stops: [],
                  polyline: null,
                  markers: null,
                  relativeUrl: `/line/${lineAndChecked.line.id}/points-and-stops`,
                  color: this.colors[lineAndChecked.line.id % this.colors.length]
                };
                
                this.getPointsAndStops(this.linesForShowing[lineAndChecked.line.id]);
              }
          } 
          else {
              if (this.linesForShowing[lineAndChecked.line.id]) {
                  this.hide(this.linesForShowing[lineAndChecked.line.id]);
              }
              else {
                  this.toastr.warning('The completeLine you need to remove can not be found in Google Maps');
              }
          }
        }
      );
  }

  getPointsAndStops(lineForShowing: LineForShowing) {
    this.stopService.get<PointsAndStops>(lineForShowing.relativeUrl) .subscribe(
      pointsAndStops => {
        lineForShowing.points = pointsAndStops.points;
        lineForShowing.stops = pointsAndStops.stops;
    
        if (lineForShowing.points) {
          if (lineForShowing.points.length > 0) {
            this.toastr.success('Points, for checked completeLine, are successfully loaded!');
          }
          else {
            this.toastr.warning('There are no points, for checked completeLine, at the moment!');
          }
        }
        else {
          this.toastr.error('Problem with loading points, for checked completeLine!');
          return;
        }

        if (lineForShowing.stops) {
          if (lineForShowing.stops.length > 0) {
            this.toastr.success('Stops, for checked completeLine, are successfully loaded!');
          }
          else {
            this.toastr.warning('There are no stops, for checked completeLine, at the moment!');
          }
        }
        else {
          this.toastr.error('Problem with loading stops, for checked completeLine!');
          return;
        }

        this.show(lineForShowing);
      },
      error => alert('Error: ' + JSON.stringify(error))
    );
  }

  show(lineForShowing: LineForShowing) {
    // Zoom and center map automatically by stations (each station will be in visible map area)
    let lngs: any;
    let lats: any;
    
    if (lineForShowing.stops.length > 0) {
      lngs = lineForShowing.stops.map(stop => stop.longitude);
      lats = lineForShowing.stops.map(stop => stop.latitude);  
    }
    else {
      lngs = lineForShowing.points.map(point => point.lng);
      lats = lineForShowing.points.map(point => point.lat);
    }
    
    this.map.fitBounds({
      west: Math.min.apply(null, lngs),
      east: Math.max.apply(null, lngs),
      north: Math.min.apply(null, lats),
      south: Math.max.apply(null, lats),
    });
  
    // Divide route to several parts because max stations limit is 25 (23 waypoints + 1 origin + 1 destination)
    /*this.parts = [];
    const max = 25 - 1;
    for (let i = 0; i < this.stops.length; i = i + max) {
      this.parts.push(this.stops.slice(i, i + max + 1));
    }*/
    
    this.drawLine(lineForShowing);
    this.drawStops(lineForShowing);
  }

  hide(lineForShowing: LineForShowing) {
    this.removeLine(lineForShowing);
    this.removeStops(lineForShowing);
  }

  drawLine(lineForShowing: LineForShowing): void {
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

  // ukloni liniju ako postoji		
  removeLine(lineForShowing: LineForShowing) {
    if (lineForShowing.polyline != null) {
      lineForShowing.polyline.setMap(null);
    }
  }
  
  drawStops(lineForShowing: LineForShowing) {
    if (!lineForShowing.markers) {
      this.createMarkers(lineForShowing);
    }

    for (const marker of lineForShowing.markers) {
      marker.setMap(this.map);
    }
  }

  createMarkers(lineForShowing: LineForShowing) {
    const firstStopImage: any = {
      url: '/assets/icons/a.svg',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    const lastStopImage: any = {
      url: '/assets/icons/b.svg',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    

    let relativeUrlPicture: string = '/assets/icons/bus_station_blue.png';

    if (lineForShowing.name.includes('B')) {
      /*const tmp = firstStopImage;
      firstStopImage = lastStopImage;
      lastStopImage = tmp;*/

      relativeUrlPicture = '/assets/icons/bus_station_red.png';
    }
    
    const otherImage: any = {
      url: relativeUrlPicture,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    
    lineForShowing.markers = [];
    // Show stations on the map as markers
    for (let i = 0; i < lineForShowing.stops.length; i++) {
      let image;
      if (i === 0) {
        image = firstStopImage;
      } 
      else if (i === lineForShowing.stops.length - 1) {
        image = lastStopImage;
      }
      else {
        image = otherImage;
      }

      const marker = this.addMarker(image, {lat: lineForShowing.stops[i].latitude, lng: lineForShowing.stops[i].longitude},
                               lineForShowing.stops[i].name);
      lineForShowing.markers.push(marker);
    }
  } 

  addMarker(image, latlng, title): any {
    const infowindow = new google.maps.InfoWindow({
        content: title
    });
    
    const marker = new google.maps.Marker({
        position: latlng, 
        // map: this.map, 
        icon: image,
        infowindow: title
    });  
    
    google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.open(this.map, marker);
    }); 

    google.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close();
    });

    return marker;
  }

  removeStops(lineForShowing: LineForShowing) {
    if (lineForShowing.markers) {
      for (const marker of lineForShowing.markers) {
        marker.setMap(null);
      }
    }
  
  }

}
