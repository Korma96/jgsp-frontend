import {Inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Line} from '../../model/line';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  scheduleUrl = '';
  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) {
    this.scheduleUrl = this.baseUrl + '/schedule';
  }

  getDates(lineId: number): Observable<string[]> {
    const url: string = this.scheduleUrl + `/${lineId}` + '/dates';
    return this.http.get<string[]>(url);
  }

  // date: yyyy-MM-dd
  getTimes(lineId: number, date: string, dayType: number): Observable<string[]> {
    const url: string = this.scheduleUrl + `/${lineId}` + `/${date}` + `/${dayType}` + '/times';
    return this.http.get<string[]>(url);
  }

  removeTime(lineId: number, date: string, dayType: number, time: string) {
    const url: string = this.scheduleUrl + `/${lineId}` + `/${date}` + `/${dayType}` + `/${time}`;
    return this.http.delete(url);
  }

  addTime(lineId: number, date: string, dayType: number, time: string) {
    const url: string = this.scheduleUrl + `/${lineId}` + `/${date}` + `/${dayType}` + `/${time}`;
    return this.http.post(url, {});
  }

  saveSchedule(scheduleDto: any) {
    const url: string = this.scheduleUrl + '/add';
    return this.http.post(url, scheduleDto);
  }
}
