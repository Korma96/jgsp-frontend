import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CanActivateUserGuard implements CanActivate {

  mapRelativeUrlToUserType: any = {
    'passenger': 'PASSENGER',
    'user-admin': 'USER_ADMINISTRATOR',
    'checkticket': 'CONTROLLOR',
    'priceticket': 'TRANSPORT_ADMINISTRATOR'
  };

  constructor(private authenticationService: AuthenticationService, private router: Router,
              private toastr: ToastrService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //alert('next: ' + next.url + ', state: ' + state.url);
    if (this.authenticationService.isLoggedIn() && 
        this.authenticationService.getCurrentUser().roles[0] === this.mapRelativeUrlToUserType[next.url.toString()]) {
      return true;
    }
    else {
      this.router.navigate(['/login']);
      this.toastr.info('Please log in.');
      return false;
    }
  }
}
