import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  public user;
  public wrongUsernameOrPass: boolean;

  constructor(private authenticationService: AuthenticationService, private router: Router){
    this.user = {};
    this.wrongUsernameOrPass = false;
  }

  ngOnInit() {
  }

  login(): void{
    this.authenticationService.login(this.user.username,this.user.password)
    .subscribe((loggedIn: boolean) => {
      if(loggedIn){
        this.router.navigate(['/passenger']);
      }
    },(err: Error) => {
      if(err.toString() === 'Ilegal login'){
        this.wrongUsernameOrPass = true;
        console.log(err);
      }else{
        Observable.throw(err);
      }
    });
  }


}
