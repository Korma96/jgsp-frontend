import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  
  constructor(private injector: Injector) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authenticationService: AuthenticationService = this.injector.get(AuthenticationService);
    
    request = request.clone({
      setHeaders: { 'X-Auth-Token': `${authenticationService.getToken()}`}
    });

    return next.handle(request);
  }
}
