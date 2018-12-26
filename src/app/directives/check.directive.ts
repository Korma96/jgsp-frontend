import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCheck]'
})
export class CheckDirective {

  @Input('appCheck') selector: string;

  @Input() color: string;

  enableColor: boolean;
  
  @HostListener('click') click() {
    const tokens: string[] = this.selector.split(',');

    this.el.nativeElement.querySelectorAll(tokens[0]).forEach(
      element => element.style.background = this.color
    );

    this.el.nativeElement.querySelectorAll(tokens[1]).forEach(
      element => {
        if (this.enableColor) {
          element.style.background = this.color;
          element.style.boxShadow = '0 0 0 2px ' + this.color + ',0 0 4px ' + this.color;
          this.enableColor = false;
        }
        else {
          element.style.background = 'gray';
          element.style.boxShadow = '0 0 0 2px white,0 0 4px white';
          this.enableColor = true;
        }
      }
    );
  }

  /*@HostListener('mouseleave') leave() {
    this.el.nativeElement.querySelectorAll(this.selector).forEach(element => {
      element.style.backgroundColor = null;
    });
  }*/

  constructor(private el: ElementRef) { 
    this.enableColor = true;
  }

}
