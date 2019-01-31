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
    'priceticket': 'TRANSPORT_ADMINISTRATOR',
    'transport': 'TRANSPORT_ADMINISTRATOR'
  };

  constructor(private authenticationService: AuthenticationService, private router: Router,
              private toastr: ToastrService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //alert('next: ' + next.url + ', state: ' + state.url);
    if (this.authenticationService.isLoggedIn()) {
      const roles: any[] = this.authenticationService.getCurrentUser().roles;

      if (roles && (roles.length === 1 || roles.length === 2)) {
        const userType = this.mapRelativeUrlToUserType[next.url.toString()];
        if (roles.length === 1) {
          if (roles[0] === userType) {
            return true;
          }
        }
        else if (roles.length === 2) {
          if (roles[0] === userType || roles[1] === userType) {
            return true;
          }
        }
      }
    }

    this.router.navigate(['/login']);
    this.toastr.info('Please log in.');
    return false;
  }
}
