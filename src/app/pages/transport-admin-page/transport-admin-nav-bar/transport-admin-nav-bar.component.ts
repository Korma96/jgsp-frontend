import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transport-admin-nav-bar',
  templateUrl: './transport-admin-nav-bar.component.html',
  styleUrls: ['./transport-admin-nav-bar.component.css']
})
export class TransportAdminNavBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  navigateToAddZonePage() {
    alert('add zone page!');
  }

  navigateToAddLinePage() {
    alert('add line page!');
  }

  navigateToAddStopPage() {
    alert('add stop page!');
  }

  navigateToAddSchedulePage() {
    alert('add schedule page!');
  }
}
