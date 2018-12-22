import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Zone} from '../../../models/zone';
import {Line} from '../../../models/line';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private readonly zonePath = 'http://localhost:8080/jgsp/zone';
  constructor(private http: HttpClient) { }
  getAll(): Observable<Object[]> {
    console.log('pre getAll u servi');
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'origin-list');
    const path = this.zonePath + '/all';
    try {
      return this.http.get<Object[]>(path);
    } catch (e) {
      console.log(e);
    }
    // , { headers : headers }
    // .pipe(catchError(err =>
    // throwError(err.message || 'Server error')));
  }
  getLines(id: any): Observable<Line[]> {
    const path = this.zonePath + `/line/${id}`;
    return this.http.get<Line[]>(path).pipe(catchError(err =>
      throwError(err.message || 'Server error')));
  }
}
