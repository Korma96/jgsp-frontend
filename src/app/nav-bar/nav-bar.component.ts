import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  imageLogoPath = '/assets/images/jgsp_logo.png'  ;
  constructor() { }
  ngOnInit() {
  }

}
