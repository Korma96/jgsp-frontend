import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangeAccountTypeService {

  relativeUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string) {
    this.relativeUrl = '/passengers/change-account-type';
  }

  post(passengerType, formData: any) { // u formData je image (tj. file)
    return this.http.post(this.baseUrl + this.relativeUrl + '/' + passengerType, formData);
  }
  
}
