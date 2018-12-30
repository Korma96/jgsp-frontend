import { Injectable } from '@angular/core';
import {Line} from '../../model/line';
import {CompleteLine} from '../../model/complete-line';

@Injectable({
  providedIn: 'root'
})
export class HelperMethodsService {

  constructor() { }

  compare(a, b) {
    const aa: number = parseInt(a.name);
    const bb: number = parseInt(b.name);
    if (isNaN(aa) || isNaN(bb)) {
      if (a.name < b.name) {
        return -1;
      }
      else if (a.name > b.name) {
        return 1;
      }
      else {
        return 0;
      }
    }
    else {
      if (aa < bb) {
        return -1;
      }
      else if (aa > bb) {
        return 1;
      }
      else {
        return 0;
      }
    }
  }

  getListOfLists<T>(elemsPerRow: number, list: T[]): T[][] {
    let row = [];
    let i = 0;
    const listOfLists = [];

    for (const elem of list) {
      if (i !== 0) {
        if (i % elemsPerRow === 0) {
          listOfLists.push(row);
          row = [];
        }
      }
      row.push(elem);
      i++;
    }

    listOfLists.push(row);
    return listOfLists;
  }

  getCompleteLinesFromLines(lines: Line[]): CompleteLine[] {
    const completeLines: CompleteLine[] = [];
    let counter: number = 1;
    let completeLine: CompleteLine = { aLineId: 0, bLineId: 0, name: ''};
    for (const line of lines) {
      if (counter % 2 === 1) {
        completeLine.name = line.name.substr(0, line.name.length - 1);
        completeLine.aLineId = line.id;
      }
      else {
        completeLine.bLineId = line.id;
        completeLines.push(completeLine);
        completeLine = { aLineId: 0, bLineId: 0, name: ''};
      }

      counter++;
    }

    return completeLines;
  }

}
