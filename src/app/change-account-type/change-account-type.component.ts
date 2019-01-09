import { Component, OnInit} from '@angular/core';
import { ChangeAccountTypeService } from '../services/change-account-type/change-account-type.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-change-account-type',
  templateUrl: './change-account-type.component.html',
  styleUrls: ['./change-account-type.component.css']
})
export class ChangeAccountTypeComponent implements OnInit {

  passengerTypes: string[] = ['STUDENT', 'PENSIONER'];

  newPassengerType: string;

  form: FormGroup;
  

  constructor(private changeAccountTypeService: ChangeAccountTypeService, private toastr: ToastrService,
              private fb: FormBuilder, public authenticationService: AuthenticationService) { 
    this.newPassengerType = this.passengerTypes[0];
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      image: [null, Validators.required]
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('image').setValue(file);
    }
  }

  prepareSave(): any {
    const formData = new FormData();
    formData.append('image', this.form.get('image').value);
    return formData;
  }

  send() {
    let stopSending: boolean = false;

    if(!this.form.get('image').value) {
      this.toastr.error('you did not select the image!')
      stopSending = true;
    }

    if(!this.newPassengerType || this.newPassengerType === '') {
      this.toastr.error('Passenger type must not be empty!');
      stopSending = true;
    }

    if(!this.passengerTypes.includes(this.newPassengerType)) {
      this.toastr.error('Passenger type must be a student and a pensioner!');
      stopSending = true;
    }
   
    if(stopSending) {
      return;
    }

    const formData: FormData = this.prepareSave();

    this.changeAccountTypeService.post(this.newPassengerType, formData).subscribe(
      () => this.toastr.success('Successfully changed account type!'),
      err => this.toastr.error('Unsuccessfully changed account type!')
    );
  }
}
