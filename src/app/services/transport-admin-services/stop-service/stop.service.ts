import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Stop} from '../../../model/stop';

@Injectable({
  providedIn: 'root'
})
export class StopService {
  stopUrl: string;
  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) {
    this.stopUrl = this.baseUrl + '/stop';
  }

  getAll(): Observable<Stop[]> {
    const path = this.stopUrl + '/all';
    return this.http.get<Stop[]>(path);
  }

  add(stop: Stop) {
    const path = this.stopUrl + '/add';
    return this.http.post(path, {'name': stop.name, 'latitude': stop.latitude, 'longitude': stop.longitude});
  }

  rename(stop: Stop) {
    const path = this.stopUrl + '/rename';
    return this.http.post(path, { 'id': stop.id, 'name': stop.name });
  }

  changeCoordinates(stop: Stop) {
    const path = this.stopUrl + '/coordinates';
    return this.http.post(path, {'id': stop.id, 'latitude': stop.latitude, 'longitude': stop.longitude});
  }
}
