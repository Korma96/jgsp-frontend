import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LineAndTimes } from '../model/line-and-times';

@Injectable({
  providedIn: 'root'
})
export class TimesService {
  
  private relativeUrl;

  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) { 
    this.relativeUrl = '/line/times';
  }

  get(date: string, day: string, lines: string[]): Observable<LineAndTimes[]> {
    const params: HttpParams = new HttpParams().append('date', date).append('day', day).append('lines', lines.join(','));
    console.log('date: ' + params.get('date') + ', day: ' + params.get('day') + ', lines: ' + params.get('lines'));
    return this.http.get<LineAndTimes[]>(this.baseUrl + this.relativeUrl, {params: params});
  }
}
