import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GenericService } from '../services/generic/generic.service';
import { UserFrontend } from '../model/user-frontend';
import { ToastrService } from 'ngx-toastr';
import { AdminForBackend } from '../model/admin-for-backend';

@Component({
  selector: 'app-show-admins',
  templateUrl: './show-admins.component.html',
  styleUrls: ['./show-admins.component.css']
})
export class ShowAdminsComponent implements OnInit {
  
  @Input()
  admins: UserFrontend[];

  relativeUrl: string;

  @Output()
  adminDeleted = new EventEmitter();

  constructor(private genericService: GenericService, private toastr: ToastrService) {
    this.relativeUrl = '/userAdmin';
  }

 
  ngOnInit() {

  }


  delete(id: number) {
    this.genericService.delete(this.relativeUrl, id).subscribe(
      () => {
          this.adminDeleted.emit();
          this.toastr.success('Successfully deleted admin!');
      },
      () => this.toastr.error('Delete was not successful')
    );
  }
  activate(admin: UserFrontend){
    this.genericService.put(this.relativeUrl + "/activation/" + admin.id, true).subscribe(
      (res: boolean) => {
        if (res) {
          this.adminDeleted.emit();
          if (admin.userStatus === "ACTIVATED") {
            this.toastr.success('Successfully deactivated admin!');
            admin.userStatus = "DEACTIVATED";
          }
          else if (admin.userStatus === "DEACTIVATED") {
            admin.userStatus = "ACTIVATED";
            this.toastr.success('Successfully activated admin!');
          }
        }
        else {
          this.toastr.error('De/Activation was not successful')
          }
        },
        () => this.toastr.error('Delete was not successful')
    );
  }

}
