import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Line} from '../../../model/line';

@Injectable({
  providedIn: 'root'
})
export class LineService {
  lineUrl: string;
  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) {
    this.lineUrl = this.baseUrl + '/line';
  }

  getAll(): Observable<Line[]> {
    const path = this.lineUrl + '/all';
    return this.http.get<Line[]>(path);
  }

  rename(line: Line) {
    const path = this.lineUrl + '/rename';
    return this.http.post(path, line);
  }
}
