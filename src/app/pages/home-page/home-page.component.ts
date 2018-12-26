import { Component, OnInit } from '@angular/core';
import { Line } from 'src/app/model/line';
import { GenericService } from 'src/app/services/generic/generic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  lines: Line[];

  private relativeUrl: string;
  

  constructor(private lineService: GenericService<Line>, private toastr: ToastrService) {
    this.relativeUrl = '/line/all';
  }

  ngOnInit() {
    this.getLines();
  }

  getLines() {
    this.lineService.getAll(this.relativeUrl) .subscribe(
      lines => {
        this.lines = lines;
        if (this.lines) {
          if (this.lines.length > 0) {
            this.toastr.success('Lines are successfully loaded!');
          }
          else {
            this.toastr.warning('There are no lines at the moment!');
          }
        }
        else {
          this.toastr.error('Problem with loading lines!');
        }
      },
      error => console.log('Error: ' + JSON.stringify(error))
    );
  }

}
