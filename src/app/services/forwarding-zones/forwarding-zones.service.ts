import { Injectable, Output, EventEmitter } from '@angular/core';

import { ZoneWithLines } from 'src/app/model/zone-with-lines';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForwardingZonesService {

  /*
    How does ReplaySubject work?

    It keeps in memory the last event emitted and will emit it again to every new subscriber.
     Actually, you can also change the constructor parameter from 1 to the number you need, 
     in order to keep in memory more events and emit them again when you subscribe it:
      new ReplaySubject(5).
  */
  replaySubject: ReplaySubject<ZoneWithLines[]> = new ReplaySubject<ZoneWithLines[]>(1);

  constructor() { }

  sendZones(zones: ZoneWithLines[]) {
    this.replaySubject.next(zones);
  }
}
