import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  imageLogoPath: string = '/assets/images/jgsp_logo.png';
  
  constructor(public authenticationService: AuthenticationService) { }
  
  ngOnInit() {
  }
  

}
