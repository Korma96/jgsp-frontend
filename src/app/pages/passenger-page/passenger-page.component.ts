import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-passenger-page',
  templateUrl: './passenger-page.component.html',
  styleUrls: ['./passenger-page.component.css']
})
export class PassengerPageComponent implements OnInit {
  busIcon: string = '/assets/icons/bus.png';
  tramIcon: string = '/assets/icons/tram.png';
  metroIcon: string = '/assets/icons/metro.png';
  
  constructor() { }

  ngOnInit() {
  }

  buyTicket() {

  }  

}
