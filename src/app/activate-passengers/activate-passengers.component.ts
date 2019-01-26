import { Component, OnInit } from '@angular/core';
import { Passenger } from '../model/passenger';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activate-passengers',
  templateUrl: './activate-passengers.component.html',
  styleUrls: ['./activate-passengers.component.css']
})
export class ActivatePassengersComponent implements OnInit {

  passengers: Passenger[];
  relativeUrlForPassengers: string;
  relativeUrlForActivation: string;

  constructor(private genericService: GenericService, private toastr: ToastrService) {
      this.relativeUrlForPassengers = '/userAdmin/get-deactivated-passengers';
    this.relativeUrlForActivation = '/userAdmin/activate-passenger';
  }
  
ngOnInit() {
  this.getPassengers();
}

getPassengers() {
  this.genericService.getAll<Passenger>(this.relativeUrlForPassengers).subscribe(
    (passengers: Passenger[]) => {
        this.passengers = passengers;
        if (this.passengers) {
          if (this.passengers.length > 0) {    
            this.toastr.success('Deactivated passengers are successfully loaded!');
          }
          else {
            this.toastr.warning('There are no deactivated passenger at the moment!');
          }
        }
        else {
          this.toastr.error('Problem with loading of deactivated passengers!');
        }
    },
    error => console.log('Error: ' + JSON.stringify(error))
  );

}

activatePassenger(passenger: Passenger) {
  this.genericService.put<boolean>(this.relativeUrlForActivation + '/' + passenger.id, true).subscribe(
    (res: boolean) => {
      if (res) {
        const index = this.passengers.indexOf(passenger); 
        if (index !== -1) {
          this.passengers.splice(index, 1);
      
        }        
        this.toastr.success('Successfully activated passenger!');
      }
      else {
        this.toastr.error('Activation was not successful');
      }
    },
    () => this.toastr.error('Activation was not successful')
  );
}

}
