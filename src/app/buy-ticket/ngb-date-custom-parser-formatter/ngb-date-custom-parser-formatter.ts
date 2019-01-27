import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';


@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  
    // dd.mm.yyyy.
    parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('.');
      if ((dateParts.length === 3 || (dateParts.length === 4 && dateParts[3] === ''))
       && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {

        const date = {day: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), year: this.toInteger(dateParts[2])};

        if (this.isValidDate(date)) { // proveravamo da li je datum validan
            return date;
        }
      }
    }
    return null;
  }

  /*date && date.day === checkDate.getDay() && date.month === checkDate.getMonth()+1 && 
            date.year === checkDate.getFullYear() && date.year > 0 && date.month > 0 && date.day > 0 */

  isValidDate(ngbDate: NgbDateStruct) {
    const date = new Date();
    date.setFullYear(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    // month - 1 since the month index is 0-based (0 = January)
  
    if ( (date.getFullYear() === ngbDate.year) && (date.getMonth() === ngbDate.month - 1)
     && (date.getDate() === ngbDate.day) ) {
      return true;
     }
  
    return false;
  }

  format(date: NgbDateStruct): string {
    return date ?
        `${this.isInteger(date.day) ? this.padNumber(date.day) : ''}.${this.isInteger(date.month) 
          ? this.padNumber(date.month) : ''}.${date.year}.` :
        '';
  }

  isNumber(value: any): value is number {
    return !isNaN(this.toInteger(value));
  }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  isInteger(value: any): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }

  padNumber(value: number) {
    if (this.isInteger(value)) {
      return `0${value}`.slice(-2);
    } 
    else {
      return '';
    }
  }
}
