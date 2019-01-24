import { Component, OnInit } from '@angular/core';
import { UserFrontend } from 'src/app/model/user-frontend';
import { GenericService } from 'src/app/services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-admin-page',
  templateUrl: './user-admin-page.component.html',
  styleUrls: ['./user-admin-page.component.css']
})
export class UserAdminPageComponent implements OnInit {

  admins: UserFrontend[];
  
  relativeUrl: string;

  constructor(private adminService: GenericService, private toastr: ToastrService) {
    this.relativeUrl = '/userAdmin/get-admins';
   }

  ngOnInit() {
    this.getAdmins();
  }

  getAdmins() {
    this.adminService.getAll<UserFrontend>(this.relativeUrl).subscribe(
      (admins: UserFrontend[]) => { 
          this.admins = admins;
          if (this.admins) {
            if (this.admins.length > 0) {
              this.toastr.success('Admins are successfully loaded!');
            }
            else {
              this.toastr.warning('There are no admins at the moment!');
            }
          }
          else {
            this.toastr.error('Problem with loading of admins!');
          }
      },
      error => console.log('Error: ' + JSON.stringify(error))
    );

  }

}
