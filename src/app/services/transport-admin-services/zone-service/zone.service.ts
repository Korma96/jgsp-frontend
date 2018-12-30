import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Zone} from '../../../model/zone';
import {Line} from '../../../model/line';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private readonly zonePath = 'http://localhost:8080/jgsp/zone';
  constructor(private http: HttpClient) { }

  getLines(id: any): Observable<Line[]> {
    const path = this.zonePath + `/line/${id}`;
    return this.http.get<Line[]>(path).pipe(catchError(err =>
      throwError(err.message || 'Server error')));
  }
}
