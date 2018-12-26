import { Component, OnInit } from '@angular/core';
import { Line } from '../../../model/line';
import { GenericService } from '../../../services/generic/generic.service';
import { LineService } from '../../../services/transport-admin-services/line-service/line.service';

@Component({
  selector: 'app-line-page',
  templateUrl: './line-page.component.html',
  styleUrls: ['./line-page.component.css']
})
export class LinePageComponent implements OnInit {
  lines: Line[];
  constructor(private lineService: LineService, private genericService: GenericService<Line>) { }

  ngOnInit() {
    this.genericService.getAll('/line/all').subscribe(lines => this.lines = lines);
  }
}
