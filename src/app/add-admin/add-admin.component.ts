import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserFrontend } from '../model/user-frontend';
import { AdminForBackend } from '../model/admin-for-backend';
import { GenericService } from '../services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  userTypes: string[] = ['USER_ADMINISTRATOR', 'TRANSPORT_ADMINISTRATOR', 'CONTROLLOR'];
  
  admin: AdminForBackend;

  relativeUrl: string;

  @Output()
  adminAdded = new EventEmitter();

  constructor(private genericService: GenericService, private toastr: ToastrService) {
    this.admin = {username: '', password: '', userType: this.userTypes[0]};
    this.relativeUrl = '/userAdmin/add-admin';
  }

  ngOnInit() {
  }

  save() {
    let stopAdding: boolean = false;

    if (!this.admin.username || this.admin.username === '') {
      this.toastr.error('Username is empty!');
      stopAdding = true;
    }
    if (!this.admin.password || this.admin.password === '') {
      this.toastr.error('Password is empty!');
      stopAdding = true;
    }

    if (!this.admin.userType || this.admin.userType === '') {
      this.toastr.error('User type is empty!');
      stopAdding = true;
    }
    if (!this.userTypes.includes(this.admin.userType)) {
      this.toastr.error('User type is empty!');
      stopAdding = true;
    }

    if (stopAdding) {
      return;
    }

    this.genericService.save(this.relativeUrl, this.admin).subscribe(
      (retValue: boolean) => {
        if (retValue) {
          this.adminAdded.emit();
          this.toastr.success('You have successfully added admin!');
        }
        else {
          this.toastr.error('Username already exists, try again!');
        }
      },
      () => this.toastr.error('You have unsuccessfully added admin!')
    );
    
  }

}
