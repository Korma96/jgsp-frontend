import { TestBed } from '@angular/core/testing';

import { HelperMethodsService } from './helper-methods.service';
import {CompleteLine} from '../../model/complete-line';
import {Line} from '../../model/line';

describe('HelperMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelperMethodsService = TestBed.get(HelperMethodsService);
    expect(service).toBeTruthy();
  });

  it('should create complete lines', () => {
    const service: HelperMethodsService = TestBed.get(HelperMethodsService);
    const lines: Line[] = [{'id': 1, 'name': '1A'}, {'id': 2, 'name': '1B'}, {'id': 22, 'name': '45A'}, {'id': 17, 'name': '45B'}];
    const completeLines: CompleteLine[] = service.getCompleteLinesFromLines(lines);
    expect(completeLines.length).toBe(2);
    expect(completeLines[0].aLineId).toBe(1);
    expect(completeLines[0].bLineId).toBe(2);
    expect(completeLines[1].aLineId).toBe(22);
    expect(completeLines[1].bLineId).toBe(17);
    expect(completeLines[0].name).toBe('1');
    expect(completeLines[1].name).toBe('45');
  });

  it('should sort times in asc order', () => {
    const service: HelperMethodsService = TestBed.get(HelperMethodsService);
    const unsortedTimes: string[] = ["11:21", "22:56", "04:11"];
    const sortedTimes: string[] = service.sortTimes(unsortedTimes);
    expect(sortedTimes[0]).toBe("04:11");
    expect(sortedTimes[1]).toBe("11:21");
    expect(sortedTimes[2]).toBe("22:56");
  });

  it('should create list of lists from list', () => {
    const service: HelperMethodsService = TestBed.get(HelperMethodsService);
    const list: string[] = ['111', '11', '1', '22', '2', '222', '3'];
    const listOfLists: string[][] =  service.getListOfLists(3, list);
    expect(listOfLists.length).toBe(3);
    expect(listOfLists[0].length).toBe(3);
    expect(listOfLists[1].length).toBe(3);
    expect(listOfLists[2].length).toBe(1);
  });
});
