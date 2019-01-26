import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PriceticketDTOFrontend } from '../model/priceticket-dtoFrontend';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private value = new BehaviorSubject<boolean>(false);
  currentValue = this.value.asObservable();

  constructor() { }

  changeValue(newValue: boolean) {
    this.value.next(newValue);
  }




}
