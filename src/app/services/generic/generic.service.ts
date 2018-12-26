import { Injectable, Injector, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlSegment } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {
  
  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) {}

  getAll(relativeUrl: string): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl + relativeUrl);
  }

  get(relativeUrl: string): Observable<T> {
    // const params: HttpParams = new HttpParams().set('_id',id);
    return this.http.get<T>(this.baseUrl + relativeUrl);
  }

  getUsingId(relativeUrl: string, id: number): Observable<T> {
    // const params: HttpParams = new HttpParams().set('_id',id);
    return this.http.get<T>(this.baseUrl + relativeUrl + `/${id}`);
  }

  save(relativeUrl: string, t: T) {
    return this.http.post(this.baseUrl + relativeUrl, t);
  }

  delete(relativeUrl: string, id: number) {
    return this.http.delete(this.baseUrl + relativeUrl + `/${id}`);
  }

}
