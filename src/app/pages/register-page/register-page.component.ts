import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic/generic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  public passengerDTO;
  private relativeUrl;
  private index_pt: number;

  constructor(private registerService: GenericService, private router: Router) {
    this.passengerDTO = {};
    this.relativeUrl = '/passengers/registrate';
    this.index_pt = 0;
   }

  ngOnInit() {
  }

  registrate() {
    this.registerService.save(this.relativeUrl, JSON.stringify({username: this.passengerDTO.username,
      password1: this.passengerDTO.password1, password2: this.passengerDTO.password2, firstName: this.passengerDTO.firstName,
      lastName: this.passengerDTO.lastName, email: this.passengerDTO.email,
       address: this.passengerDTO.address})).subscribe(
        (res: any) => {
          if (res) {
            this.router.navigate(['/login']);
          }
        }
      );
  }



}