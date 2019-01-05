import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GenericService } from '../services/generic/generic.service';
import { UserFrontend } from '../model/user-frontend';
import { ToastrService } from 'ngx-toastr';

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

}
