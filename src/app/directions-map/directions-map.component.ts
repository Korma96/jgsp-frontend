import {GoogleMapsAPIWrapper} from '@agm/core/services/google-maps-api-wrapper';
import { Component, OnInit, Input, Inject, OnChanges, SimpleChanges, SimpleChange, OnDestroy} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { GenericService } from 'src/app/services/generic/generic.service';
import { colors } from '../resources/colors';
import { PointsAndStops } from '../model/points-and-stops';
import { ToastrService } from 'ngx-toastr';
import { LineForShowing } from '../model/line-for-showing';
import { CheckSliderService } from '../services/check-slider/check-slider.service';
import { LineAndChecked } from '../model/line-and-checked';
import { Point } from '../model/point';
import { refreshDescendantViews } from '@angular/core/src/render3/instructions';

declare var google: any;



@Component({
  selector: 'app-directions-map',
  templateUrl: './directions-map.component.html',
  styleUrls: ['./directions-map.component.css']
})
export class DirectionsMapComponent implements OnInit, OnChanges, OnDestroy {

  colors: string[];

   firstStopImage: any = {
    url: '/assets/icons/a.svg'/*,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)*/
  };
  lastStopImage: any = {
    url: '/assets/icons/b.svg'/*,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)*/
  };

  otherStopBlueImage: any = {
    url: '/assets/icons/bus_station_blue.png'/*,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)*/
  };

  otherStopRedImage: any = {
    url: '/assets/icons/bus_station_red.png'/*,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)*/
  };

  busImage: any = {
    url: '/assets/icons/bus.png'/*,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)*/
  };

  linesForShowing: LineForShowing[];

  map: any;
  // directionsService: any;
  // directionsDisplay: any;

  @Input()
  postionsOfVehiclesChecked: boolean;

  @Input()
  neverShowPositionOfVehicles: boolean;

  private serverSocketRelativeUrl = '/socket';
  private stompClient;

  relativeUrlForAddLineForShowPostions: string;
  relativeUrlForRemoveLineForShowPostions: string;
  

  constructor (@Inject('BASE_API_URL') private baseUrl: string,
              private gmapsApi: GoogleMapsAPIWrapper, 
              private stopService: GenericService,
              private toastr: ToastrService,
              private checkSliderService: CheckSliderService,
              private genericService: GenericService) {

    this.linesForShowing = [];
    this.colors = colors; // importovani colors

    if(!this.neverShowPositionOfVehicles) { // 
      this.initializeWebSocketConnection();
    }

    this.relativeUrlForAddLineForShowPostions = '/simulation/add-line-for-show-postions';
    this.relativeUrlForRemoveLineForShowPostions = '/simulation/line-for-show-postions';
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.neverShowPositionOfVehicles) {
      const postionsOfVehiclesChecked: SimpleChange = changes.postionsOfVehiclesChecked;

      if(!postionsOfVehiclesChecked.firstChange) {
        console.log('prev value: ', postionsOfVehiclesChecked.previousValue);
        console.log('got name: ', postionsOfVehiclesChecked.currentValue);
        this.postionsOfVehiclesChecked = postionsOfVehiclesChecked.currentValue;
  
        this.postionsOfVehiclesChanged();  
      }
      
    }
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
                  color: this.colors[lineAndChecked.line.id % this.colors.length],
                  markersForVehicles: [],
                  subscription: null
                };
                
                this.getPointsAndStops(this.linesForShowing[lineAndChecked.line.id]);
              }
              if(!this.neverShowPositionOfVehicles && this.postionsOfVehiclesChecked) {
                  this.addLineForShowPositonsOfVehicles(lineAndChecked.line.id);
              }
              
          } 
          else {
              if (this.linesForShowing[lineAndChecked.line.id]) {
                  this.hide(this.linesForShowing[lineAndChecked.line.id]);
                  if(!this.neverShowPositionOfVehicles && this.postionsOfVehiclesChecked) {
                      this.removeLineForShowPositonsOfVehicles(lineAndChecked.line.id);
                  }
                  
              }
              else {
                  this.toastr.warning('The completeLine you need to remove can not be found in Google Maps');
              }
          }
        }
      );
  }

  ngOnDestroy() {
    // uklanjamo sva vozila i unscribujemo se sa svih subscribovanih linija
    this.postionsOfVehiclesChecked = false;
    this.postionsOfVehiclesChanged();

    if(!this.neverShowPositionOfVehicles && this.stompClient) {
      this.stompClient.disconnect(
        () => this.toastr.info('The connection with the vehicles was interrupted!')
      );
    }
    
  }

  addLineForShowPositonsOfVehicles(id: number) {
    this.genericService.post(this.relativeUrlForAddLineForShowPostions, id)
    .subscribe(
      () => {
        this.subscribe(id);
        this.toastr.success('Successfuly added line for show postions of vehciles!')
      },
      (err) => this.toastr.error('Unsuccessfuly added line for show postions of vehciles!')
    );
  }

  removeLineForShowPositonsOfVehicles(id: number) {
    this.genericService.delete(this.relativeUrlForRemoveLineForShowPostions, id)
    .subscribe(
      () => {
        this.unsubscribe(id);
        this.toastr.success('Successfuly removed line for show postions of vehciles!')
      },
      (err) => {
        this.unsubscribe(id);
        this.toastr.error('Unsuccessfuly removed line for show postions of vehciles!')
      }
    );
  }

  initializeWebSocketConnection(){
    let socket = new SockJS(this.baseUrl + this.serverSocketRelativeUrl);
    this.stompClient = Stomp.over(socket);

    // prva lambda funkcija je callback za uspesno konektovanje, a druga lambda fukcija za pucanje konekcije
    this.stompClient.connect({}, (frame) => {}, () => this.toastr.info('The connection with the vehicles was interrupted!') );
  }

  postionsOfVehiclesChanged() {
    let id; // tj. index

    for (let lfs of this.linesForShowing) {
      if (lfs) {
        if (lfs.polyline) { // ako je ova linija trenutno aktivna
          if(lfs.polyline.getMap()) {
            id = this.linesForShowing.indexOf(lfs);

            if(this.postionsOfVehiclesChecked) {
              this.addLineForShowPositonsOfVehicles(id);
            }
            else {
              this.removeLineForShowPositonsOfVehicles(id);
            }
          }
        }
      }
        
    }
    
  }

  subscribe(id: number) {
    if(this.postionsOfVehiclesChecked) {
      this.linesForShowing[id].subscription = this.stompClient.subscribe(`/topic/${id}`, (message) => {
        if(message.body) {
          this.refreshPositionsOfVehicles(this.linesForShowing[id], message.body);
        }
        else this.toastr.error('Empty body in a websocket message!');
      });
    }

  }

  refreshPositionsOfVehicles(lineForShowing: LineForShowing, message: string) {
    lineForShowing.markersForVehicles.forEach(marker => marker.setMap(null));

    const positionsOfVehicles: Point[] = this.extractPositionsOfVehicles(message);
    lineForShowing.markersForVehicles = []

    for(let i = 0; i < positionsOfVehicles.length; i++){
      let marker = this.addMarker(this.busImage, positionsOfVehicles[i], 
        'line: ' + lineForShowing.name + ', bus_'+ (i+1));
      marker.setMap(this.map);
      lineForShowing.markersForVehicles.push(marker);
    }
  }

  unsubscribe(id: number) {
    if(this.linesForShowing[id].subscription) {
      this.linesForShowing[id].subscription.unsubscribe(); // vise necemo slusati poruke za line sa ovim id,
                                                          // koje dobijamo preko websocket-a
    }
    
    this.linesForShowing[id].markersForVehicles.forEach(marker => marker.setMap(null));
    this.linesForShowing[id].markersForVehicles = [];
  }

  extractPositionsOfVehicles(message: string): Point[] {
      const positionsOfVehicles: Point[] = []
      
      if(message) {
        const tokens: string[] = message.split(';');
        tokens.forEach(token => {
          const tokens2: string[] = token.split(',');
          positionsOfVehicles.push( { lat: +tokens2[0], lng: +tokens2[1] } );
        });
        
      }

      return positionsOfVehicles;
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
      err => this.toastr.error('Error: ' + JSON.stringify(err))
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
    
    let otherImage = this.otherStopBlueImage;

    //let relativeUrlPicture: string = '/assets/icons/bus_station_blue.png';

    if (lineForShowing.name.includes('B')) {
      /*const tmp = firstStopImage;
      firstStopImage = lastStopImage;
      lastStopImage = tmp;*/

      //relativeUrlPicture = '/assets/icons/bus_station_red.png';
      otherImage = this.otherStopRedImage;
    }
    
    
    
    lineForShowing.markers = [];
    // Show stations on the map as markers
    for (let i = 0; i < lineForShowing.stops.length; i++) {
      let image;
      if (i === 0) {
        image = this.firstStopImage;
      } 
      else if (i === lineForShowing.stops.length - 1) {
        image = this.lastStopImage;
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
