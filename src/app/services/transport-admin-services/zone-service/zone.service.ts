import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Zone} from '../../../model/zone';
import {Line} from '../../../model/line';
import {catchError} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string, private toastr: ToastrService) {
  }

  getLines(id: any): Observable<Line[]> {
    const path = this.baseUrl + `/zone/line/${id}`;
    return this.http.get<Line[]>(path).pipe(catchError(err =>
      throwError(err.message || 'Server error'))
    );
  }
}
