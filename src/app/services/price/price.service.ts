import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  
  private relativeUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) { 
    this.relativeUrl = '/passengers/get-price';
  }

  get(hasZoneNotLine: boolean, ticketType: string, zone: string): Observable<number> {
    const params: HttpParams = new HttpParams().append('hasZoneNotLine', ''+hasZoneNotLine).append('ticketType', ticketType).append('zone', zone);
    console.log('hasZoneNotLine: ' + params.get('hasZoneNotLine') + ', ticketType: ' + params.get('ticketType') + ', zone: ' + params.get('zone'));
    return this.http.get<number>(this.baseUrl + this.relativeUrl, {params: params});
  }
}
