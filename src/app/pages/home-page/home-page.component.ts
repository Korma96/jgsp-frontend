import { Component, OnInit } from '@angular/core';
import { Line } from 'src/app/model/line';
import { GenericService } from 'src/app/services/generic/generic.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  lines: Line[];

  private relativeUrl: string;

  constructor(private lineService: GenericService<Line>) {
    this.relativeUrl = '/line/all'; 
  }

  ngOnInit() {
    this.getLines();
  }

  getLines() {
    this.lineService.getAll(this.relativeUrl) .subscribe(
      lines => this.lines = lines,
      error => alert('Error: ' + JSON.stringify(error))
    );
  }

}
