import {Component, OnInit} from '@angular/core';
import {Line} from '../../../../model/line';
import {GenericService} from '../../../../services/generic/generic.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-line',
  templateUrl: './add-line.component.html',
  styleUrls: ['./add-line.component.css']
})
export class AddLineComponent implements OnInit {
  lineNames: string[];
  newLineName: string;

  constructor(private toastr: ToastrService,
              private router: Router,
              private genericService: GenericService) {
    this.lineNames = [];
    this.newLineName = '';
  }

  ngOnInit() {
    this.genericService.getAll<Line>('/line/all').subscribe(lines => {
      lines.forEach(l => this.lineNames.push(l.name.substr(0, l.name.length - 1)));
    });
  }

  confirmLineName() {
    if (this.newLineName.trim() === '') {
      this.toastr.warning('Line name can not be empty or whitespace');
      return;
    }
    if (this.lineNames.findIndex(ln => ln === this.newLineName) !== -1) {
      this.toastr.warning(`Line with name ${this.newLineName} already exists!`);
      return;
    }

    this.genericService.post('/line/add', {'name': this.newLineName + 'A'}).subscribe(() => {
      this.genericService.post('/line/add', {'name': this.newLineName + 'B'}).subscribe(() => {
        this.toastr.success('Line successfully added');
        this.router.navigate(['transport/line']);
      }, error => {
        console.log(JSON.stringify(error));
        this.toastr.error(error.error.error);
      });
    }, error => {
      console.log(JSON.stringify(error));
      this.toastr.error(error.error.error);
    });
  }

}
