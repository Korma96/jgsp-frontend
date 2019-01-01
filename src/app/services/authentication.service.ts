import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtUtilsService } from './jwt-utils.service';
import { HttpHeaders } from '@angular/common/http';
import { error } from 'util';
import { GenericService } from './generic/generic.service';
import { Observable } from 'rxjs/Rx';



@Injectable()
export class AuthenticationService {
  private relativeUrl;

  constructor(private loginService: GenericService, private jwtUtilsService: JwtUtilsService) {
    this.relativeUrl = '/users/login';
  }

  login(username: string, password: string): Observable<boolean> {
    return this.loginService.put(this.relativeUrl, JSON.stringify({username, password}))
    .map(
      (res: any) => {
        const token = res && res['token'];
        if (token) {
          localStorage.setItem('currentUser', JSON.stringify({username, password,
                roles: this.jwtUtilsService.getRoles(token), token: token}));
              return true;
        }
        else {
          return false;
        }
      }
    ).catch((error: any) => {
      if (error.status === 400 ) {
        return Observable.throw('Ilegal login');
      } else {
        return Observable.throw(error.json().error || 'Server error');
      }
    });
  }


  getToken(): String {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    return token ? token : '';
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    if (this.getToken() !== '') {
      return true;
    }
    return false;
  }

  getCurrentUser() {
    if (localStorage.currentUser) {
      return JSON.parse(localStorage.currentUser);
    } else {
      return undefined;
    }
  }

}