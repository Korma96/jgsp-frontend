import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  
  constructor(private injector: Injector, private router: Router) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authenticationService: AuthenticationService = this.injector.get(AuthenticationService);
    
    request = request.clone({
      setHeaders: { 'X-Auth-Token': `${authenticationService.getToken()}`}
    });

    const observable: Observable<HttpEvent<any>> = next.handle(request);
    observable.subscribe(
      () => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) { // Unauthorized || Forbidden
            console.log('err.error =', err.error, ';');
            authenticationService.logout(); // brisemo token ako je postojao i istekao
                                            // i teramo korisnika da se ponovo uloguje
            this.router.navigate(['/login']);
          }
          
        }
      }
    );

    return observable;
  }
}
