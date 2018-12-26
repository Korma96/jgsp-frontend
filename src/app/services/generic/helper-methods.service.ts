import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperMethodsService {

  constructor() { }

  getListOfLists<T>(elemsPerRow: number, list: T[]): T[][] {
    let row = [];
    let i = 1;
    const listOfLists = [];
    for (const zone of list) {
      if (i % (elemsPerRow + 2) === (elemsPerRow + 1)) {
        listOfLists.push(row);
        row = [];
      }
      row.push(zone);
      i++;
    }

    listOfLists.push(row);
    return listOfLists;
  }

}
