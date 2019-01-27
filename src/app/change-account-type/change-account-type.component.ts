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

  fileName: string;
  

  constructor(private changeAccountTypeService: ChangeAccountTypeService, private toastr: ToastrService,
              private fb: FormBuilder, public authenticationService: AuthenticationService) { 
    this.newPassengerType = this.passengerTypes[0];
    this.fileName = 'Choose file';
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
      this.fileName = file.name;
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

    const file = this.form.get('image').value;
    if (!file) {
      this.toastr.error('You did not select the image!');
      stopSending = true;
    }
    else {
      const fileSizeInMb: number = file.size / 1024 / 1024;
      if (fileSizeInMb > 1) {
        this.toastr.error('The maximum allowed file size is 1 Mb! The size of your file is '
         + fileSizeInMb.toFixed(2) + ' Mb');
         stopSending = true;
      }
    }

    if (!this.newPassengerType || this.newPassengerType === '') {
      this.toastr.error('Passenger type must not be empty!');
      stopSending = true;
    }

    if (!this.passengerTypes.includes(this.newPassengerType)) {
      this.toastr.error('Passenger type must be a student and a pensioner!');
    }
   
    if (stopSending) {
      return;
    }

    const formData: FormData = this.prepareSave();

    this.changeAccountTypeService.post(this.newPassengerType, formData).subscribe(
      () => this.toastr.success('Request to change the account type was successfully sent!'),
      err => this.toastr.error('Request to change the account type was unsuccessfully sent!')
    );
  }
}
