import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Price } from 'src/app/model/price';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  
  private relativeUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) { 
    this.relativeUrl = '/passengers/get-price';
  }

  get(ticketType: string, zone: string): Observable<Price> {
    const params: HttpParams = new HttpParams().append('ticketType', ticketType).append('zone', zone);
    console.log('ticketType: ' + params.get('ticketType') + ', zone: ' + params.get('zone'));
    return this.http.get<Price>(this.baseUrl + this.relativeUrl, {params: params});
  }
}
